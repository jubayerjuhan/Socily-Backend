import catchAsyncError from "../middlewares/catchasyncError.js";
import postModal from "../Modals/postModal.js";
import commentModal from "../Modals/commentModal.js";
import Errorhandler from "../Utils/errorHandle.js";

export const createPost = catchAsyncError(async (req, res, next) => {
  const { caption } = req.body;

  if (!caption && !req.files)
    return next(new Errorhandler("Please add some text or image", 400));

  const images = [];
  if (req.files) {
    req.files.map((file) => {
      images.push(file.filename);
    });
  }
  console.log(images);

  const post = new postModal({
    caption,
    images,
    user: req.user._id,
  });

  await post.save();

  res.status(200).json({
    success: true,
    message: "Post created",
    post,
  });
});

// comment on post
export const commentOnPost = catchAsyncError(async (req, res, next) => {
  const { postId, text } = req.body;
  console.log(text, postId);
  const comment = new commentModal({
    text,
    user: req.user._id,
    post: postId,
  });

  await comment.save();

  const post = await postModal.findById(postId);
  if (!post) return next(new Errorhandler("Post not found", 404));
  post.comments.push(comment._id);
  await post.save();

  res.status(200).json({
    success: true,
    message: "Comment created",
    comment,
  });
});

// get all comments on post
export const getCommentsOnPost = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const post = await postModal.findById(id);
  if (!post) return next(new Errorhandler("Post not found", 404));

  const comments = await commentModal
    .find({ post: id })
    .populate("user", "name email avatar");

  res.status(200).json({
    success: true,
    comments,
  });
});

// get single post
export const getSinglePost = catchAsyncError(async (req, res, next) => {
  const { postId } = req.params;
  const post = await postModal.findById(postId);
  if (!post) return next(new Errorhandler("Post not found", 404));

  res.status(200).json({
    success: true,
    post,
  });
});
