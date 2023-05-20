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
const session_1 = __importDefault(require("./middleware/session"));
const http_1 = require("http");
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const body_parser_1 = __importDefault(require("body-parser"));
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const typedefs_1 = __importDefault(require("./graphql/typedefs"));
(0, dotenv_1.config)();
const port = process.env.PORT || 5000;
const url = process.env.URL || `http://localhost:${port}/graphql`;
const app = (0, express_1.default)();
const startApi = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.DB_URL) {
            throw new Error("Cannot Connect to database");
        }
        yield (0, connect_1.default)(process.env.DB_URL);
        const httpServer = (0, http_1.createServer)(app);
        const server = new server_1.ApolloServer({
            typeDefs: typedefs_1.default,
            resolvers: resolvers_1.default,
            introspection: process.env.NODE_ENV !== "production",
            csrfPrevention: true,
        });
        yield server.start();
        const corsOption = { origin: "http://localhost:3000", credentials: true };
        app.use((0, cors_1.default)(corsOption));
        app.use((req, res, next) => (0, session_1.default)(req, res, next));
        app.use("/graphql", body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server, {
            context: ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
                return ({
                    userData: {
                        userId: req.userData.userId || null,
                        email: req.userData.email || null,
                    },
                });
            }),
        }));
        httpServer.listen(port);
        console.log(`🚀  Server ready at: ${url}`);
    }
    catch (error) {
        console.log(error);
    }
});
startApi();
