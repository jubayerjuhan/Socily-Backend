import {
  createUser,
  loginUser,
  sendOtpAgain,
  verifyUser,
} from "../Controller/userController.js";
import { Router } from "express";
import { verifyJwtToken } from "../Utils/jwtToken.js";
const router = Router();

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/verify-user").post(verifyJwtToken, verifyUser);
router.route("/request-otp").post(verifyJwtToken, sendOtpAgain);

export default router;
