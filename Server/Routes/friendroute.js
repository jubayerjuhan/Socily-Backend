import { Router } from "express";
import {
  acceptFriendRequest,
  getFriends,
  sendFriendRequest,
} from "../Controller/friendsController.js";
import { verifyJwtToken } from "../Utils/jwtToken.js";
import { upload } from "../Utils/multer.js";
const router = Router();

router.route("/send-req").post(verifyJwtToken, sendFriendRequest);
router.route("/accept-req").put(verifyJwtToken, acceptFriendRequest);
router.route("/friends").get(verifyJwtToken, getFriends);

export default router;
