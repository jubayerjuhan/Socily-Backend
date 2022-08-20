import catchAsyncError from "../middlewares/catchasyncError.js";
import friendsModal from "../Modals/friendsModal.js";
import Errorhandler from "../Utils/errorHandle.js";

export const sendFriendRequest = catchAsyncError(async (req, res, next) => {
  const { receiverId } = req.body;

  const sender = await friendsModal.findOne({ user: req.user._id });
  if (!sender) return next(new ErrorHandler("You are not a user", 400));

  if (
    sender.sentReq.includes(receiverId) ||
    sender.receivedReq.includes(receiverId) ||
    sender.friends.includes(receiverId)
  )
    return next(
      new Errorhandler("The User Already Exist On Your Friends", 400)
    );
  sender.sentReq.push(receiverId);
  await sender.save();

  //
  const receiver = await friendsModal.findOne({ user: receiverId });
  if (!receiver)
    return next(new ErrorHandler("Friend Req Reciever User Not Found", 404));
  receiver.receivedReq.push(req.user._id);
  await receiver.save();

  res.status(200).json({
    success: true,
    message: "Friend request sent",
  });
});

// get all friends
export const getFriends = catchAsyncError(async (req, res, next) => {
  const friends = await friendsModal
    .findOne({ user: req.user._id })
    .populate("sentReq receivedReq friends", "name email avatar");
  console.log(friends);

  res.status(200).json({
    success: true,
    friends,
  });
});

// accept friend request
export const acceptFriendRequest = catchAsyncError(async (req, res, next) => {
  const { senderId } = req.body;

  const receiver = await friendsModal.findOne({ user: req.user._id });
  if (!receiver) return next(new Errorhandler("Receiver User Not Found", 404));

  if (!receiver.receivedReq.includes(senderId))
    return next(new Errorhandler("You have no friend request", 400));

  const sender = await friendsModal.findOne({ user: senderId });
  if (!sender) return next(new Errorhandler("Sender User Not Found", 404));

  receiver.receivedReq.pull(senderId);
  receiver.friends.push(senderId);
  await receiver.save();

  sender.sentReq.pull(req.user._id);
  sender.friends.push(req.user._id);
  await sender.save();

  res.status(200).json({
    success: true,
    message: "Friend Request Accepted",
  });
});
