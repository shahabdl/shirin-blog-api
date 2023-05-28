import mongoose from "mongoose";

const ConnectToDB = async (url: string) => {
  return mongoose
    .connect(url)
    .then(() => console.log(`Connected to DataBase`));
};

export default ConnectToDB;