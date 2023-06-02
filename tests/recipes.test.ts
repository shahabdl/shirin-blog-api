import setupTest from "./setup";
import { closeDbConnection } from "./utils/db";
import { ApolloServer } from "@apollo/server";
import TypeDefs from "../server/graphql/typedefs";
import Resolvers from "../server/graphql/resolvers";
import {
  CreateRecipeResult,
  createRecipeMutation,
  createReciptMutationVariables,
  queryGetRecipes,
  queryGetRecipesResult,
  queryGetRecipesVariables,
} from "./queries/recipe";
import assert from "assert";
import mongoose from "mongoose";
import { createSession } from "./utils/session";
import { createUser } from "./utils/session";

const server = new ApolloServer({
  typeDefs: TypeDefs,
  resolvers: Resolvers,
});

beforeAll(async () => {
  await setupTest();
});
afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const index in collections) {
    await collections[index].deleteMany({});
  }
});
afterAll(async () => {
  await closeDbConnection();
});

test("server should prevent creating recipe when user is not author", async () => {
  let testUser = await createUser("user");
  const response = await server.executeOperation(
    {
      query: createRecipeMutation,
      variables: createReciptMutationVariables(),
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
  expect(response.body.singleResult.errors).not.toBeNull();
});

test("server should prevent creating recipe when userId is not valid", async () => {
  let testUser = await createUser("user");
  const response = await server.executeOperation(
    {
      query: createRecipeMutation,
      variables: createReciptMutationVariables(),
    },
    {
      contextValue: {
        userData: {
          userId: new mongoose.Types.ObjectId(),
          email: testUser.email,
        },
      },
    }
  );
  assert(response.body.kind === "single");
  expect(response.body.singleResult.errors).not.toBeNull();
});

test("api should create new recipe, categories and ingredients with current user as author and return them to client", async () => {
  const { token, testUser } = await createSession("author");
  const response = await server.executeOperation(
    {
      query: createRecipeMutation,
      variables: createReciptMutationVariables(),
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
  expect(response.body.singleResult.data).not.toBeNull();
  expect(response.body.singleResult.data?.CreateRecipe).toMatchObject(
    CreateRecipeResult
  );
  const authorObject = {
    author: {
      id: testUser._id.toString(),
      username: testUser.username,
    },
  };
  expect(response.body.singleResult.data?.CreateRecipe).toMatchObject(
    authorObject
  );
  return;
});

test("getRecipes resolver should return first n recipes with offset of m", async () => {
  const authorUser = await createUser("author");
  const testUser = await createUser("user");

  for (let i = 0; i < 10; i++) {
    let recipeVariables = createReciptMutationVariables({
      name: `Recipe_${i}`,
      image: `Recipe_${i}_Image.jpg`,
    });
    await server.executeOperation(
      {
        query: createRecipeMutation,
        variables: recipeVariables,
      },
      {
        contextValue: {
          userData: { userId: authorUser._id, email: authorUser.email },
        },
      }
    );
  }

  const response = await server.executeOperation(
    {
      query: queryGetRecipes,
      variables: queryGetRecipesVariables,
    },
    {
      contextValue: {
        userData: { userId: testUser._id, email: testUser.email },
      },
    }
  );

  assert(response.body.kind === "single");
  expect(response.body.singleResult.data?.Recipes).toMatchObject(
    queryGetRecipesResult
  );
}, 30000);
