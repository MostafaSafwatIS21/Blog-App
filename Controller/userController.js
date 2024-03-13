const catchHandler = require("./../uitils/catchHandler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("./../uitils/AppError");
const { validateUpdate } = require("./../uitils/validate");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage,
} = require("./../uitils/cloudinary");
const { log } = require("console");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
/**
 * @Retrive all users
 * @Method Get
 * @Route /getUsers
 * @Access Admin
 */

module.exports.getUsers = catchHandler(async (req, res, next) => {
  const users = await User.find()
    .select("-password")
    .populate("posts");
  res.status(200).json({
    status: "Successfully",
    data: {
      users,
    },
  });
});

/**
 * @get  user
 * @Method Get
 * @Route /user/:id
 * @Access public
 */
module.exports.getUser = catchHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("posts");
  console.log(user);
  if (!user) {
    return next(new AppError("Can't find user", 404));
  }
  res.status(200).json({
    status: "Successfully",
    data: {
      user,
    },
  });
});

/**
 * @updata  user
 * @Method put
 * @Route /user/:id
 * @Access private user only himself
 */
module.exports.updateUser = catchHandler(async (req, res, next) => {
  const { error } = validateUpdate(req.body);
  if (error) {
    return res.status(404).json({
      Error: error,
    });
  }
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 12);
  }
  const userUpdate = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    { new: true }
  ).select("-password");
  res.status(201).json({
    status: "Sccussfully",
    newData: {
      userUpdate,
    },
  });
});
/**
 * @upload  user photo
 * @Method post
 * @Route /user/uploade-profile-photo
 * @Access private user only himself
 */
module.exports.profilePhoto = catchHandler(async (req, res, next) => {
  //validate image
  if (!req.file) {
    res.status(300).json({ message: " No file attach" });
  }

  // get path image
  const pathImage = path.join(__dirname, `../images/${req.file.filename}`);
  // upload image to cloudinary
  const result = await cloudinaryUploadImage(pathImage);

  // delete user profile if user has already photo
  const user = await User.findById(req.user);
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }
  // set profile field in DB
  const profile = (user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  });
  await user.save();
  // return response
  res.status(201).json({
    message: " Upload photo sucessfully",
    profilePhoto: profile,
  });
  // delete image from server
  fs.unlinkSync(pathImage);
});

/**
 * @Delete  user profile
 * @Method delete
 * @Route /user/delete-user-ptofile/:id
 * @Access private user only himself
 */
module.exports.deleteUserProfile = catchHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(400).json({
      message: "Can't find user ",
    });
  }
  const posts = await Post.find({ user: user._id });
  const publicIds = posts.map((post) => {
    post.image.publicId;
  });
  if (publicIds.length > 0) {
    await cloudinaryRemoveMultipleImage(publicIds);
  }

  await Post.deletetMany({ user: user._id });
  await Comment.deletetMany({ user: user._id });
  await User.findByIdAndDelete(req.params.id);
  res.json({
    message: `Successfully delete ${user.username}`,
  });
});
