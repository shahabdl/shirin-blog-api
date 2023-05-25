const CommentTypeDefs = `#graphql
    scalar Date

    input CreateCommentArgs{
        recipe: ID
        title: String
        content: String
        parent: ID
    }

    type Mutation{
        createComment(createCommentArgs: CreateCommentArgs): Comment
    }
    type Query{
        getRecipeComments(id: ID): [Comment]
        getCommentReplies(id: ID): [Comment]
    }

    type Comment{
        author: UserData
        id: ID
        recipe: ID
        title: String
        content: String
        replies: [Comment]
        replyCount: Int
        creationDate: Date
        parent: Comment

    }

`;
export default CommentTypeDefs;
