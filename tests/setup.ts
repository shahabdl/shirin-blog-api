import mongoose from "mongoose";
import { connectToDb } from "./utils/db";

mongoose.Promise = global.Promise;

const setupTest = async () => {
  await connectToDb();

  return;
};

export default setupTest;
