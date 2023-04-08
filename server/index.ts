import express from "express";
import { config } from "dotenv";
import { graphqlHTTP } from "express-graphql";
import schema from './schema/recipe-schema';
config();
const port = process.env.PORT || 5000;


const app = express();
console.log('test 2');

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development'
}));


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
