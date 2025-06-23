import mongoose from "mongoose";
import { DB_NAME } from "../../constants";

const connection = {}

async function connectDb() {
  if (connection.isConnect) {
    console.log('Already connected to database');
    return;
  }
  try {
    const dbConnection = await mongoose.connect(`${process.env.MONGODB_CONNECTION_URI}/${DB_NAME}` || '', {});
    connection.isConnect = dbConnection.connections[0].readyState;
    console.log('DB Connected Successfully')
  } catch (error) {
    console.log('Database connection Failed: ', error);
    process.exit(1);
  }
}

export { connectDb }