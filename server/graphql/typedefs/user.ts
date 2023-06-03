const UserTypedefs = `#graphql
    type UserData {
        username: String
        email: String
        id: ID
        isVIP: Boolean
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

export default UserTypedefs;
