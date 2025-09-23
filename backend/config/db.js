import mongoose from "mongoose";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const configDB = async () => {
  const mongoUrl = process.env.MONGO_URI;

  if (!mongoUrl) {
    console.error("Mongo URL not found! Check your Render environment variables.");
    return;
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to the database!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
