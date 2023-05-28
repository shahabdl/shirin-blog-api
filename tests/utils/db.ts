import mongoose from "mongoose";
import "dotenv/config";

export const connectToDb = async () => {
  await mongoose
    .connect(process.env.DB_URL as string)
    .then(() => console.log("connected to db"));
  return;
};

export const closeDbConnection = async()=>{
    await mongoose.connection.close();
    return;
}

