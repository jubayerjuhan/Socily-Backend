import {
  createUser,
  loginUser,
  sendOtpAgain,
  getSingleUser,
  verifyUser,
  searchUser,
  getMe,
} from "../Controller/userController.js";
import { Router } from "express";
import { verifyJwtToken } from "../Utils/jwtToken.js";
import { upload } from "../Utils/multer.js";
const router = Router();

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/verify-user").post(verifyJwtToken, verifyUser);
router.route("/request-otp").post(verifyJwtToken, sendOtpAgain);
router.route("/user/:id").get(verifyJwtToken, getSingleUser);
router.route("/searchuser/:name").get(verifyJwtToken, searchUser);
router.route("/me").get(verifyJwtToken, getMe);

export default router;
