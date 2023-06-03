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
  queryGetRecipesByCategory,
  queryGetRecipesByCategoryResult,
  queryGetRecipesByCategoryVIPResult,
  queryGetRecipesResult,
  queryGetSingleRecipeById,
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
  let testUser = await createUser("User");
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
          role: testUser.role,
          isVIP: testUser.isVIP,
        },
      },
    }
  );
  assert(response.body.kind === "single");
  expect(response.body.singleResult.errors).not.toBeNull();
});

test("server should prevent creating recipe when userId is not valid", async () => {
  let testUser = await createUser("User");
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
          role: testUser.role,
          isVIP: testUser.isVIP,
        },
      },
    }
  );
  assert(response.body.kind === "single");
  expect(response.body.singleResult.errors).not.toBeNull();
});

test("api should create new recipe, categories and ingredients with current user as author and return them to client", async () => {
  const { token, testUser } = await createSession("Author");
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
          role: testUser.role,
          isVIP: testUser.isVIP,
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
  const authorUser = await createUser("Author");
  const testUser = await createUser("User");

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
          userData: {
            userId: authorUser._id,
            email: authorUser.email,
            role: authorUser.role,
            isVIP: testUser.isVIP,
          },
        },
      }
    );
  }

  const response = await server.executeOperation(
    {
      query: queryGetRecipes,
      variables: { first: 5, offset: 5 },
    },
    {
      contextValue: {
        userData: {
          userId: testUser._id,
          email: testUser.email,
          role: testUser.role,
          isVIP: testUser.isVIP,
        },
      },
    }
  );

  assert(response.body.kind === "single");
  expect(response.body.singleResult.data?.Recipes).toMatchObject(
    queryGetRecipesResult
  );
}, 30000);

test("getSingleRecipeByID resolver should return recipe with id if available", async () => {
  const authorUser = await createUser("Author");
  const testUser = await createUser("User");

  const recipeVariables = createReciptMutationVariables({});
  const recipe = await server.executeOperation<
    Record<"CreateRecipe", { id: string }>
  >(
    {
      query: createRecipeMutation,
      variables: recipeVariables,
    },
    {
      contextValue: {
        userData: {
          userId: authorUser._id,
          email: authorUser.email,
          role: authorUser.role,
          isVIP: testUser.isVIP,
        },
      },
    }
  );
  assert(recipe.body.kind === "single");
  const response = await server.executeOperation(
    {
      query: queryGetSingleRecipeById,
      variables: { id: recipe.body.singleResult.data?.CreateRecipe?.id },
    },
    {
      contextValue: {
        userData: {
          userId: testUser._id,
          email: testUser.email,
          role: testUser.role,
          isVIP: testUser.isVIP,
        },
      },
    }
  );

  assert(response.body.kind === "single");
  expect(response.body.singleResult.data?.getSingleRecipeById).toMatchObject({
    name: "Recipe_1",
  });
}, 30000);

test("getSingleRecipeByID should not return VIP Recipes if user is not VIP or Author", async () => {
  const authorUser = await createUser("Author");
  const testUser = await createUser("User");

  const recipeVariables = createReciptMutationVariables({ vip: true });
  const recipe = await server.executeOperation<
    Record<"CreateRecipe", { id: string }>
  >(
    {
      query: createRecipeMutation,
      variables: recipeVariables,
    },
    {
      contextValue: {
        userData: {
          userId: authorUser._id,
          email: authorUser.email,
          role: authorUser.role,
          isVIP: testUser.isVIP,
        },
      },
    }
  );
  assert(recipe.body.kind === "single");

  const response = await server.executeOperation(
    {
      query: queryGetSingleRecipeById,
      variables: { id: recipe.body.singleResult.data?.CreateRecipe?.id },
    },
    {
      contextValue: {
        userData: {
          userId: testUser._id,
          email: testUser.email,
          role: testUser.role,
          isVIP: false,
        },
      },
    }
  );

  assert(response.body.kind === "single");
  expect(response.body.singleResult.data?.getSingleRecipeById).toBeNull();
}, 30000);

test("getRecipesByCategory should return list of recipes of requested category", async () => {
  const authorUser = await createUser("Author");
  const testUser = await createUser("User");
  const recipeVariables = createReciptMutationVariables({
    name: `Recipe_0`,
    categories: ["testCat"],
  });

  const recipe = await server.executeOperation<
    Record<string, { categories: [{ id: string }] }>
  >(
    {
      query: createRecipeMutation,
      variables: recipeVariables,
    },
    {
      contextValue: {
        userData: {
          userId: authorUser._id,
          email: authorUser.email,
          role: authorUser.role,
          isVIP: testUser.isVIP,
        },
      },
    }
  );
  assert(recipe.body.kind === "single");
  const catID = recipe.body.singleResult.data?.CreateRecipe.categories[0].id;

  for (let i = 1; i < 10; i++) {
    const recipeVariables = createReciptMutationVariables({
      name: `Recipe_${i}`,
      categories: ["testCat"],
    });
    await server.executeOperation(
      {
        query: createRecipeMutation,
        variables: recipeVariables,
      },
      {
        contextValue: {
          userData: {
            userId: authorUser._id,
            email: authorUser.email,
            role: authorUser.role,
            isVIP: testUser.isVIP,
          },
        },
      }
    );
  }

  const response = await server.executeOperation(
    {
      query: queryGetRecipesByCategory,
      variables: { category: catID, first: 5, offset: 2 },
    },
    {
      contextValue: {
        userData: {
          userId: testUser._id,
          email: testUser.email,
          role: testUser.role,
          isVIP: false,
        },
      },
    }
  );

  assert(response.body.kind === "single");
  expect(response.body.singleResult.data?.getRecipesByCategory).toMatchObject(
    queryGetRecipesByCategoryResult
  );
}, 30000);

test("getRecipesByCategory should not return VIP recipe Data if user is not VIP or Author", async () => {
  const authorUser = await createUser("Author");
  const testUser = await createUser("User");
  const recipeVariables = createReciptMutationVariables({
    name: `Recipe_0`,
    categories: ["testCat"],
    description: "test",
    vip: true,
  });

  const recipe = await server.executeOperation<
    Record<string, { categories: [{ id: string }] }>
  >(
    {
      query: createRecipeMutation,
      variables: recipeVariables,
    },
    {
      contextValue: {
        userData: {
          userId: authorUser._id,
          email: authorUser.email,
          role: authorUser.role,
          isVIP: testUser.isVIP,
        },
      },
    }
  );
  assert(recipe.body.kind === "single");
  const catID = recipe.body.singleResult.data?.CreateRecipe.categories[0].id;

  for (let i = 1; i < 5; i++) {
    const recipeVariables = createReciptMutationVariables({
      name: `Recipe_${i}`,
      categories: ["testCat"],
    });
    await server.executeOperation(
      {
        query: createRecipeMutation,
        variables: recipeVariables,
      },
      {
        contextValue: {
          userData: {
            userId: authorUser._id,
            email: authorUser.email,
            role: authorUser.role,
            isVIP: testUser.isVIP,
          },
        },
      }
    );
  }

  const response = await server.executeOperation(
    {
      query: queryGetRecipesByCategory,
      variables: { category: catID, first: 5, offset: 0 },
    },
    {
      contextValue: {
        userData: {
          userId: testUser._id,
          email: testUser.email,
          role: testUser.role,
          isVIP: false,
        },
      },
    }
  );

  assert(response.body.kind === "single");
  expect(response.body.singleResult.data?.getRecipesByCategory).toMatchObject(
    queryGetRecipesByCategoryVIPResult
  );
}, 30000);
