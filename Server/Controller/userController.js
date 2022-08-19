import catchAsyncError from "../middlewares/catchasyncError.js";
import usermodal from "../Modals/usermodal.js";
import Errorhandler from "../Utils/errorHandle.js";
import { sendJwtToken } from "../Utils/jwtToken.js";

export const createUser = catchAsyncError(async (req, res, next) => {
  // body checking
  if (!req.body)
    return next(new Errorhandler("Please enter your details", 400));

  //chech if user already exist
  const userExist = await usermodal.findOne({ email: req.body.email });
  if (userExist) return next(new Errorhandler("User already exist", 400));

  //create user
  const user = await usermodal.create(req.body);
  const otpStatus = await user.sendOtp();

  sendJwtToken(res, next, user);
});

// -----------verify user through otp--------------------
export const verifyUser = catchAsyncError(async (req, res, next) => {
  console.log(req.user, "user from req");
  const { otp, email } = req.body;
  console.log(otp, email);

  // check if there otp or email missing on body;
  if (!otp || !email)
    return next(new Errorhandler("Please Fill All Fields", 400));

  // searching for user with email
  const userArray = await usermodal.find({ email });
  const user = userArray[0];

  // if there is no user
  if (!user) return next(new Errorhandler("User Not Found", 404));

  // if user already verified
  if (user?.verified)
    return next(new Errorhandler("User Already Verified", 400));

  // compare otp time
  if (user.otpValidTill < Date.now())
    return next(new Errorhandler("Otp Expired", 400));

  // compare otp
  if (otp !== user.otp) return next(new Errorhandler("Otp is incorrect", 400));

  if (otp === user.otp) {
    user.verified = true;
    user.otp = null;
    user.otpValidTill = null;
    const newuser = await user.save();
    res.status(200).json({
      success: true,
      user: newuser,
    });
  }

  console.log(otp, user);
});

// send otp again if otp expired
export const sendOtpAgain = catchAsyncError(async (req, res, next) => {
  // check if there email missing on body;
  if (!req.body.email)
    return next(new Errorhandler("Please Fill All Fields", 400));

  // searching for user with email
  const userArray = await usermodal.find({ email: req.body.email });
  const user = userArray[0];

  // if user already verified
  if (user.verified)
    return next(new Errorhandler("User Already Verified", 400));

  // compare otp time
  if (user.otpValidTill > Date.now())
    return next(new Errorhandler("Otp is still valid", 400));

  // send otp again
  const otpStatus = await user.sendOtp();

  res.status(200).json({
    success: true,
    otpStatus,
  });
});

// login user
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new Errorhandler("Please Fill Out All Field", 400));

  const user = await usermodal.findOne({ email }).select("+password");

  const validPass = await user.passwordComparison(password);

  if (validPass) return sendJwtToken(res, next, user);
});
