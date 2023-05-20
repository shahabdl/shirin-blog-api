import { GraphQlContext } from "../../utils/typedef";

const RecipeResolvers = {
  Query: {
    Recipes: async (_: any, __: any, context: GraphQlContext) => {
      console.log(context);

      return "test";
    },
  },

  Mutation: {
    CreateRecipe: async (_: any, args: any, context: GraphQlContext) => {
      return { test: `recipe ${args.name} created` };
    },
  },
};
export default RecipeResolvers;
