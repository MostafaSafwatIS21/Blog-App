const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
