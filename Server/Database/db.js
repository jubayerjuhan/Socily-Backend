import mongoose from "mongoose";

export const connectDatabase = () => {
  mongoose.connect(
    process.env.DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("Connected to database");
    }
  );
};
