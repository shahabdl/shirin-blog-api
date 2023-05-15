import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";

import { getUserById } from "../db/controller/user";

export const RecipeInputType = new GraphQLInputObjectType({
  name: "RecipeInputTpe",
  fields: {
    name: { type: GraphQLString },
  },
});

export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    image: { type: GraphQLString },
    role: { type: GraphQLString },
  }),
});

export const LikesType = new GraphQLObjectType({
  name: "Likes",
  fields: () => ({
    count: { type: GraphQLInt },
    likedUsers: {
      type: GraphQLList(UserType),
      async resolve(parent, args) {
        let usersList = [] as any[];
        for (let user in parent.likedUsers) {
          usersList.push(await getUserById(parent.likedUsers[user]));
        }
        return [...usersList];
      },
    },
  }),
});

export const TimingType = new GraphQLObjectType({
  name: "Timing",
  fields: () => ({
    preperation: { type: GraphQLInt },
    cookTime: { type: GraphQLInt },
    additional: { type: GraphQLInt },
  }),
});

export const RecipeType = new GraphQLObjectType({
  name: "Recipe",
  fields: () => ({
    id: { type: GraphQLID },
    image: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    timing: { type: TimingType },
    difficulty: { type: GraphQLString },
    likes: { type: LikesType },
    userLiked: { type: GraphQLBoolean },
    author: {
      type: UserType,
      resolve(parent, args) {
        return getUserById(parent.author);
      },
    },
  }),
});

export const ReciptPaginationType = new GraphQLObjectType({
  name: "RecipePaggination",
  fields: () => ({
    Recipes: { type: GraphQLList(RecipeType) },
    pages: { type: GraphQLInt },
    offset: { type: GraphQLInt },
  }),
});