const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username Required"],
      trim: true,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, "Username Required"],
      trim: true,
      unique: [true, "Email already exist"],
      validate: [validator.isEmail, "Enter valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "user-avatar.jpg",
        publicId: null,
      },
    },
    bio: {
      type: String,
      maxlength: 200,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      defalut: "user",
    },
    isAccountVerifies: {
      type: Boolean,
      defalut: false,
    },
    token: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "user",
});
const User = mongoose.model("User", userSchema);

module.exports = User;
