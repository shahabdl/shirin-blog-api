"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const user_1 = require("../db/controller/user");
const AuthorType = new graphql_1.GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        image: { type: graphql_1.GraphQLString },
    }),
});
const AuthorRootQuery = new graphql_1.GraphQLObjectType({
    name: "AuthorRootQuery",
    fields: {
        Author: {
            type: AuthorType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return (0, user_1.getUserById)(args.id).then((user) => {
                    if (user && user.role === "author") {
                        return user;
                    }
                    return null;
                });
            },
        },
    },
});
exports.default = new graphql_1.GraphQLSchema({ query: AuthorRootQuery });
