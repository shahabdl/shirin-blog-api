import UserData from "./typedef";

export {};

declare global {
  namespace Express {
    export interface Request {
      userData?: UserData;
    }
  }
}
