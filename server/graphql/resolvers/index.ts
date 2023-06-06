import UserResolvers from "./user";
import RecipeResolvers from "./recipes";
import merge from "lodash.merge";
import CommentResolver from "./comment";
import UIResolver from "./ui";

const Resolvers = merge({}, UserResolvers, RecipeResolvers, CommentResolver, UIResolver);

export default Resolvers;
