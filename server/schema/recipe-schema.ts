import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLList,
} from "graphql";

import { getRecipeById, getRecipesByPage } from "../db/controller/recipe";
import { getUserById } from "../db/controller/user";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    image: { type: GraphQLString },
    role: { type: GraphQLString },
  }),
});

const LikesType = new GraphQLObjectType({
  name: "Likes",
  fields: () => ({
    count: { type: GraphQLInt },
    users: {
      type: GraphQLList(UserType),
      resolve(parent, args) {
        let usersList = [];
        for (let user in parent.users) {
          usersList.push(getUserById(parent.users[user]));
        }
        return [...usersList];
      },
    },
  }),
});

const TimingType = new GraphQLObjectType({
  name: "Timing",
  fields: () => ({
    preperation: { type: GraphQLInt },
    cookTime: { type: GraphQLInt },
    additional: { type: GraphQLInt },
  }),
});

const RecipeType = new GraphQLObjectType({
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

const ReciptPaginationType = new GraphQLObjectType({
  name: "RecipePaggination",
  fields: () => ({
    Recipes: { type: GraphQLList(RecipeType) },
    pages: { type: GraphQLInt },
    offset: { type: GraphQLInt },
  }),
});

const RecipeRootQuery = new GraphQLObjectType({
  name: "RecipeRootQuery",
  fields: {
    Author: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return getUserById(args.id).then((user) => {
          if (user && user.role === "author") {
            return user;
          }
          return null;
        });
      },
    },
    Recipes: {
      type: ReciptPaginationType,
      args: { perPage: { type: GraphQLInt }, offset: { type: GraphQLInt } },
      async resolve(parent, args) {
        let test = await getRecipesByPage(args.perPage, args.offset)        
        return getRecipesByPage(args.perPage, args.offset);
      },
    },
    Recipe: {
      type: RecipeType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return getRecipeById(args.id);
      },
    },
  },
});

export default new GraphQLSchema({ query: RecipeRootQuery });
