import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "LMS-DB"; // or take from env if you like

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env file"
  );
}

/** 
 * Global cache object on `global` to prevent multiple connections 
 * in dev mode (where files can be re-imported on hot reload).
 */
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Optional: track connection status in a variable.
let isConnected = false;

export default async function connectToDB() {
  // set Mongoose options or behaviors
  mongoose.set("strictQuery", true);

  // If already connected, just return the connection
  if (isConnected && cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  // If a connection promise is not cached, create one
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: DB_NAME, // specify your database name here
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        isConnected = true;
        console.log("MongoDB connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }

  // Wait for the promise to resolve and cache the connection
  cached.conn = await cached.promise;
  return cached.conn;
}
