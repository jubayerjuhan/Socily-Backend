import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "./Database/db.js";
import userRoute from "./Routes/userrRoutes.js";
import bodyParser from "body-parser";
import { errorMiddleWare } from "./middlewares/errorMiddleware.js";

const app = express();
const port = 5000;

// config body parser
app.use(bodyParser.json());

// connect to database
connectDatabase();

app.use("/api", userRoute);

app.listen(port, () => {
  console.log("Server is running on port " + port, "....");
});

app.use(errorMiddleWare);
