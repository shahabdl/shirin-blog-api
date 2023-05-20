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

export default UserTypedefs;
