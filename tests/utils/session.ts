import user from "../../server/db/models/user";
import createNewToken from "../../server/utils/token";

export const createUser = async (role: "author" | "user") => {
  const uesrNumber = Math.round(Math.random() * 100);
  const fakeUser = await user.create({
    email: `user_${uesrNumber}@test.com`,
    image: "",
    name: `test user ${uesrNumber}`,
    role,
    password: `test`,
    username: `user_${uesrNumber}`,
  });
  return fakeUser;
};

export const createSession = async (role: "author" | "user") => {
  const testUser = await createUser(role);
  let token = await createNewToken({
    userId: testUser._id.toString(),
    email: testUser.email,
  });
  return { token, testUser };
};
