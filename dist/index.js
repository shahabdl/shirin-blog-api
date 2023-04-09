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
const express_graphql_1 = require("express-graphql");
const recipe_schema_1 = __importDefault(require("./schema/recipe-schema"));
const cors_1 = __importDefault(require("cors"));
const connect_1 = __importDefault(require("./db/connect"));
(0, dotenv_1.config)();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
const startApi = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (process.env.DB_URL) {
            yield (0, connect_1.default)(process.env.DB_URL);
            app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });
        }
        else {
            throw new Error("Cannot Connect to database");
        }
    }
    catch (error) {
        console.log(error);
    }
});
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow_Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    next();
});
startApi();
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: recipe_schema_1.default,
    graphiql: process.env.NODE_ENV === "development",
}));
