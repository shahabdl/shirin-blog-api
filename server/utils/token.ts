import jwt from "jsonwebtoken";

const createNewToken = ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  let token;
  try {
    token = jwt.sign({ userId, email }, process.env.SECRET_KEY as string);
  } catch (error) {
    console.log("when creating token in createNewToken function", error);
    return "";
  }
  return token;
};

export default createNewToken;