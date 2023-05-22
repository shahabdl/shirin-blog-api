import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const session = (req: Request, res: Response, next: NextFunction) => {
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
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };
  } else {
    return next();
  }

  return next();
};

export default session;
