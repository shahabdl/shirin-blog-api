"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserTypedefs = `#graphql
    type UserData {
        username: String
        email: String
        userId: ID
    }
    type SignupResponse {
        userData: UserData
        token: String
    }
    type Mutation { 
        signup(email: String, password: String): SignupResponse
    }
`;
exports.default = UserTypedefs;
