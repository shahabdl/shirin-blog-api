import express from "express";
import { config } from "dotenv";
import cors from "cors";
import ConnectToDB from "./db/connect";
import session from "./middleware/session";
import { createServer } from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import Resolvers from "./graphql/resolvers";
import TypeDefs from "./graphql/typedefs";

config();
const port = process.env.PORT || 5000;
const url = process.env.URL || `http://localhost:${port}/graphql`;
const app = express();

const startApi = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error("Cannot Connect to database");
    }
    await ConnectToDB(process.env.DB_URL);
    const httpServer = createServer(app);
    const server = new ApolloServer({
      typeDefs: TypeDefs,
      resolvers: Resolvers,
      introspection: process.env.NODE_ENV !== "production",
      csrfPrevention: true,
      includeStacktraceInErrorResponses: process.env.NODE_ENV !== "production",
    });
    await server.start();
    const corsOption = { origin: "http://localhost:3000", credentials: true };
    app.use(cors(corsOption));
    app.use((req, res, next) => session(req, res, next));
    app.use(
      "/graphql",
      bodyParser.json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({
          userData: {
            userId: req.userData.userId || null,
            email: req.userData.email || null,
            role: req.userData.role || null,
            isVIP: req.userData.isVIP || null,
          },
        }),
      })
    );
    httpServer.listen(port);
    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.log(error);
  }
};

startApi();
