import express from "express";
import { config } from "dotenv";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/recipe-schema";
import cors from "cors";
import ConnectToDB from "./db/connect";

config();
const port = process.env.PORT || 5000;
const app = express();

const startApi = async () => {  
  try {
    if (process.env.DB_URL) {
      await ConnectToDB(process.env.DB_URL);
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    } else {
      throw new Error("Cannot Connect to database");
    }
  } catch (error) {
    console.log(error);
  }
};
app.use(cors());

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow_Origin', '*');
  res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE');
  next();
});

startApi();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

