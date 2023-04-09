import mongoose from "mongoose";

const ConnectToDB = (url: string) => {
  return mongoose
    .connect(url)
    .then(() => console.log(`Connected to DataBase ${url}`));
};

export default ConnectToDB;