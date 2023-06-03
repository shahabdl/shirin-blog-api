import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import user from "../db/models/user";

const session = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") return next();

  req.userData = { userId: null, email: null };

  let token = req.headers.authorization?.split(" ")[1];
  if (token === "" || token === undefined || token === null) {
    return next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      token as string,
      process.env.SECRET_KEY as string
    );
  } catch (error) {
    console.log(error, "in decoding token in session middleware");
    return next();
  }

  if (typeof decodedToken !== "string") {
    const reqUser = await user.findById(decodedToken.userId);
    if(!reqUser){
      return next();
    }

    req.userData = { userId: reqUser._id, email: reqUser.email, role: reqUser.role, isVIP: reqUser.isVIP};
  } else {
    return next();
  }

  return next();
};

export default session;
