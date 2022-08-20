// import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
const { Schema } = mongoose;
import validator from "validator";
import Errorhandler from "../Utils/errorHandle.js";
import { sendEmail } from "../Utils/sendEmail.js";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  friends: {
    type: Schema.Types.ObjectId,
    ref: "friends",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please Enter a Valid Email"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
  },
  otpValidTill: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
});

// send otp to user email
userSchema.methods.sendOtp = async function () {
  const otp = Math.floor(100000 + Math.random() * 900000);
  this.otp = otp;
  this.otpValidTill = Date.now() + 1 * 60 * 1000;
  const name = this.name;
  const email = this.email;
  await this.save({ validateBeforeSave: false });

  // send otp to user email
  const message = `Hello ${name}, Your OTP is ${otp}`;
  sendEmail(name, email, otp);
};

// generate jwt token
userSchema.methods.generateJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_DAY * 24 * 60 * 60 * 1000,
  });
};

// compare passwords
userSchema.methods.passwordComparison = async function (password) {
  console.log(password, this.password);
  const validPass = await bcrypt.compare(password, this.password);

  if (!validPass) return false;
  else {
    return true;
  }
};

export default mongoose.model("User", userSchema);
