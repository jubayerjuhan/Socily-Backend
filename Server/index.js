import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "./Database/db.js";
import userRoute from "./Routes/userrRoutes.js";
import friendRoute from "./Routes/friendroute.js";
import bodyParser from "body-parser";
import { errorMiddleWare } from "./middlewares/errorMiddleware.js";

const app = express();
const port = 5000;

// config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// get multer image
app.use("/uploads", express.static("./Server/uploads"), (req, res, next) => {
  next();
});

// connect to database
connectDatabase();

app.use("/api", userRoute);
app.use("/api", friendRoute);

app.listen(port, () => {
  console.log("Server is running on port " + port, "....");
});

app.use(errorMiddleWare);
