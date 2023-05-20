import express from "express";
import { config } from "dotenv";
import cors from "cors";
import ConnectToDB from "./db/connect";
import session from "./middleware/session";
import { createServer } from "http";
import { ApolloServer } from "@apollo/server";
import RecipeTypeDefs from "./graphql/typedefs/recipes";
import RecipeResolvers from "./graphql/resolvers/recipes";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";

config();
const port = process.env.PORT || 5000;
const url = process.env.URL || `http://localhost:${port}/graphql`;
const app = express();

const startApi = async () => {
  try {
    if (process.env.DB_URL) {
      await ConnectToDB(process.env.DB_URL);
      const httpServer = createServer(app);
      const server = new ApolloServer({
        typeDefs: RecipeTypeDefs,
        resolvers: RecipeResolvers,
        csrfPrevention: true,
      });
      await server.start();
      const corsOption = { origin: "http://localhost:3000", credentials: true };
      app.use(cors(corsOption));
      app.use(
        "/graphql",
        bodyParser.json(),
        expressMiddleware(server, {
          context: async ({ req, res }) => ({
            session: { test: "test" },
          }),
        })
      );
      httpServer.listen(port);
      console.log(`🚀  Server ready at: ${url}`);
    } else {
      throw new Error("Cannot Connect to database");
    }
  } catch (error) {
    console.log(error);
  }
};

startApi();
