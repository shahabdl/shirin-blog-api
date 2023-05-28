import user from "../../server/db/models/user";

export const createUser = (role: "author"| "user") => {
    const uesrNumber = Math.round(Math.random() * 100);
    const fakeUser = user.create({
      email: `user_${uesrNumber}@test.com`,
      image: "",
      name: `test user ${uesrNumber}`,
      role,
      password: `test`,
      username: `user_${uesrNumber}`,
    });
    return fakeUser
}

export const createSession = async (role: "author" | "user") => {
  const testUser = createUser(role);
  
};

