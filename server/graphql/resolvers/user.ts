import { GraphQLError } from "graphql/error";
import user from "../../db/models/user";
import { AuthArgs } from "../../utils/typedef";
import bcrypt from "bcrypt";
import createNewToken from "../../utils/token";
import getText from "../../output_texts/get-output";

const UserResolvers = {
  Mutation: {
    signup: async (_: any, args: AuthArgs) => {
      if (!args.email || !args.password) {
        throw new GraphQLError("enter username and password");
      }
      const searchedUser = await user.findOne({ email: args.email });
      if (searchedUser) {
        throw new GraphQLError("user already exists!");
      }
      let hashedPassword = "";
      try {
        hashedPassword = await bcrypt.hash(args.password, 10);
      } catch (error) {
        console.log("when hashing password in signup resolver", error);
        throw new GraphQLError("Server error! pls try again later");
      }

      let newUser;
      try {
        newUser = await user.create({
          email: args.email,
          password: hashedPassword,
          username: "",
          name: "",
          image: "",
          likes: [],
          role: "User",
        });
      } catch (error) {
        console.log("in signup resolver", error);
        throw new GraphQLError("Server error! pls try again later");
      }
      //to clear typescript error
      if (!newUser.email) {
        throw new GraphQLError(getText("SERVER_ERROR_500", "EN"));
      }
      let token = createNewToken({
        userId: newUser._id.toString(),
        email: newUser.email,
      });

      return {
        userData: {
          email: newUser.email,
          userId: newUser._id,
          username: newUser.username,
        },
        token,
      };
    },
  },

  Query: {
    login: async (_: any, args: AuthArgs) => {
      const { email, password: hashedPassword } = args;
      const searchedUser = await user.findOne({ email });
      if (!searchedUser) {
        throw new GraphQLError(getText("WRONG_CREDENTIALS", "EN"));
      }
      //to clear typescript error
      if (!searchedUser.password || !searchedUser.email) {
        throw new GraphQLError(getText("SERVER_ERROR_500", "EN"));
      }
      const passwordIsValid = await bcrypt.compare(
        args.password,
        searchedUser.password
      );
      if (!passwordIsValid) {
        throw new GraphQLError(getText("WRONG_CREDENTIALS", "EN"));
      }
      let token;
      try {
        token = createNewToken({
          userId: searchedUser._id.toString(),
          email: searchedUser.email,
        });
      } catch (error) {
        throw new GraphQLError(getText("SERVER_ERROR_500", "EN"));
      }
      return {
        userData: {
          email: searchedUser.email,
          userId: searchedUser._id,
          username: searchedUser.username,
        },
        token,
      };
    },
  },
};

export default UserResolvers;
