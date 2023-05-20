"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const connect_1 = __importDefault(require("./db/connect"));
const http_1 = require("http");
const server_1 = require("@apollo/server");
const recipes_1 = __importDefault(require("./graphql/typedefs/recipes"));
const recipes_2 = __importDefault(require("./graphql/resolvers/recipes"));
const express4_1 = require("@apollo/server/express4");
const body_parser_1 = __importDefault(require("body-parser"));
(0, dotenv_1.config)();
const port = process.env.PORT || 5000;
const url = process.env.URL || `http://localhost:${port}/graphql`;
const app = (0, express_1.default)();
const startApi = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (process.env.DB_URL) {
            yield (0, connect_1.default)(process.env.DB_URL);
            const httpServer = (0, http_1.createServer)(app);
            const server = new server_1.ApolloServer({
                typeDefs: recipes_1.default,
                resolvers: recipes_2.default,
                csrfPrevention: true,
            });
            yield server.start();
            const corsOption = { origin: "http://localhost:3000", credentials: true };
            app.use((0, cors_1.default)(corsOption));
            app.use("/graphql", body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server, {
                context: ({ req, res }) => __awaiter(void 0, void 0, void 0, function* () {
                    return ({
                        session: { test: "test" },
                    });
                }),
            }));
            httpServer.listen(port);
            console.log(`🚀  Server ready at: ${url}`);
        }
        else {
            throw new Error("Cannot Connect to database");
        }
    }
    catch (error) {
        console.log(error);
    }
});
startApi();
