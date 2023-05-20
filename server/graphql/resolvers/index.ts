import UserResolvers from "./user"
import RecipeResolvers from "./recipes"
import merge from "lodash.merge"

const Resolvers = merge({},UserResolvers, RecipeResolvers);

export default Resolvers;