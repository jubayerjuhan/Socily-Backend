import mongoose from "mongoose";
const { Schema } = mongoose;

const friendsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sentReq: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  receivedReq: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("friends", friendsSchema);
