import UserResolvers from "./user";
import RecipeResolvers from "./recipes";
import merge from "lodash.merge";
import CommentResolver from "./comment";

const Resolvers = merge({}, UserResolvers, RecipeResolvers, CommentResolver);

export default Resolvers;
