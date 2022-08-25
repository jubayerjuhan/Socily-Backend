import { Router } from "express";
import {
  commentOnPost,
  createPost,
  getCommentsOnPost,
  getSinglePost,
} from "../Controller/postController.js";
import { verifyJwtToken } from "../Utils/jwtToken.js";
import { upload } from "../Utils/multer.js";

const router = Router();

router
  .route("/create-post")
  .post(verifyJwtToken, upload.array("images"), createPost);
router.route("/post/:postId").get(verifyJwtToken, getSinglePost);
router.route("/comment").post(verifyJwtToken, commentOnPost);
router.route("/comment/:id").get(verifyJwtToken, getCommentsOnPost);

export default router;
