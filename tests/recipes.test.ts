import setupTest from "./setup";
import { closeDbConnection } from "./utils/db";
import { ApolloServer } from "@apollo/server";
import TypeDefs from "../server/graphql/typedefs";
import Resolvers from "../server/graphql/resolvers";
import {
  createRecipeMutation,
  createReciptMutationVariables,
} from "./queries/recipe";
import assert from "assert";
import mongoose from "mongoose";
import { createSession } from "./utils/session";

const server = new ApolloServer({
  typeDefs: TypeDefs,
  resolvers: Resolvers,
});

beforeAll(async () => {
  await setupTest();
});
beforeEach(() => {});
afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const index in collections) {
    await collections[index].deleteMany({});
  }
});
afterAll(async () => {
  await closeDbConnection();
});

test("testing", async () => {
  const { token, testUser } = await createSession("author");
  const response = await server.executeOperation(
    {
      query: createRecipeMutation,
      variables: createReciptMutationVariables,
    },
    {
      contextValue: {
        userData: {
          userId: new mongoose.Types.ObjectId(testUser._id),
          email: testUser.email,
        },
      },
    }
  );
  assert(response.body.kind === "single");
  console.log(response.body.singleResult.data?.CreateRecipe);
  expect(response.body.singleResult.data).not.toBeNull();
  return;
});
