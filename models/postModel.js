const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 4,
      max: 150,
    },
    description: {
      type: String,
      required: true,
      min: 4,
    },
    category: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamp: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PostSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "postId",
  localField: "_id",
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
