import { GraphQLError } from "graphql";
import { CreateCommentArgs, GraphQlContext } from "../../utils/typedef";
import getText from "../../output_texts/get-output";
import user from "../../db/models/user";
import comments from "../../db/models/comments";
import recipe from "../../db/models/recipe";

const CommentResolver = {
  Mutation: {
    createComment: async (
      _: any,
      args: CreateCommentArgs,
      context: GraphQlContext
    ) => {
      if (!context.userData || !context.userData.userId) {
        throw new GraphQLError(getText("NOT_AUTHORIZED_MESSAGE", "EN"));
      }
      if (!args.createCommentArgs.recipe && !args.createCommentArgs.parent) {
        throw new GraphQLError(getText("COMMENT_MUST_HAVE_PARENT", "EN"));
      }
      const id = context.userData.userId;
      let author;
      try {
        author = await user.findById(id);
      } catch (error) {
        console.log(error);
        throw new GraphQLError(getText("SERVER_ERROR_500", "EN"));
      }
      if (!author) {
        throw new GraphQLError(getText("NOT_AUTHORIZED_MESSAGE", "EN"));
      }

      let newComment;
      try {
        newComment = await comments.create({
          author: id,
          content: args.createCommentArgs.content,
          title: args.createCommentArgs.title,
          parent: args.createCommentArgs.parent
            ? args.createCommentArgs.parent
            : null,
          recipe: args.createCommentArgs.recipe
            ? args.createCommentArgs.recipe
            : null,
          replyCount: 0,
        });
      } catch (error) {
        console.log("when creating comment", error);
        throw new GraphQLError(getText("SERVER_ERROR_500", "EN"));
      }
      if (args.createCommentArgs.parent) {
        let parentComment;
        try {
          parentComment = await comments.findByIdAndUpdate(
            args.createCommentArgs.parent,
            {
              $push: { replies: newComment._id },
            }
          );
          if (!parentComment) {
            throw new GraphQLError(getText("COMMENT_MUST_HAVE_PARENT", "EN"));
          }
          let replyCount = parentComment.replyCount;
          if (!replyCount) {
            replyCount = 1;
          } else {
            replyCount++;
          }
          parentComment = await parentComment.updateOne({ replyCount });
        } catch (error) {
          console.log("when searching for parent comment", error);
          throw new GraphQLError(getText("SERVER_ERROR_500", "EN"));
        }
      } else {
        let recipeParent;
        try {
          recipeParent = await recipe.findByIdAndUpdate(
            args.createCommentArgs.recipe,
            { $push: { comments: newComment._id } }
          );
          if (!recipeParent) {
            throw new GraphQLError(getText("RECIPE_NOT_FOUND", "EN"));
          }
        } catch (error) {
          throw new GraphQLError(getText("SERVER_ERROR_500", "EN"));
        }
      }
      let populatedNewComment = await newComment.populate(
        "parent replies author"
      );
      return populatedNewComment.toJSON();
    },
  },
  Query: {
    getRecipeComments: async (
      _: any,
      args: { id: string },
      context: GraphQlContext
    ) => {
        
    },
    getCommentReplies: async (
      _: any,
      args: { id: string },
      context: GraphQlContext
    ) => {

    },
  },
};

export default CommentResolver;
