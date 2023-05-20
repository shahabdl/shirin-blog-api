"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserTypedefs = `#graphql
    type UserData {
        username: String
        email: String
        userId: ID
    }
    type AuthResponse {
        userData: UserData
        token: String
    }
    type Mutation { 
        signup(email: String, password: String): AuthResponse
    }
    type Query {
        login(email:String, password: String): AuthResponse
    }
`;
exports.default = UserTypedefs;
