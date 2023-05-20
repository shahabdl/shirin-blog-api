const RecipeResolvers = {
  Query: {
    Recipes: async (_: any, __: any) => {
      return "test";
    },
  },

  Mutation:{
    CreateRecipe: async (_:any, args:any) => {
      return {test:`recipe ${args.name} created`}
    }
  }
};
export default RecipeResolvers;
