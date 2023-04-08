import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLList,
} from "graphql";

import { MockData, Authors } from "../mockData";

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    name: { type: GraphQLString },
    image: { type: GraphQLString },
  }),
});

const RecipeType = new GraphQLObjectType({
  name: "Recipe",
  fields: () => ({
    id: { type: GraphQLID },
    image: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    cookTime: { type: GraphQLInt },
    difficulty: { type: GraphQLString },
    likes: { type: GraphQLInt },
    userLiked: { type: GraphQLBoolean },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Authors[parent.author];
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    Authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent) {
        return Authors;
      },
    },
    Author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Authors[Number(args.id)];
      },
    },

    Recipes: {
      type: new GraphQLList(RecipeType),
      resolve(parent) {
        return MockData;
      },
    },
    Recipe: {
      type: RecipeType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return MockData[Number(args.id)];
      },
    },
  },
});

export default new GraphQLSchema({ query: RootQuery });
