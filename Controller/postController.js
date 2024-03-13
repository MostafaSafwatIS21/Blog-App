const fs = require("fs");
const path = require("path");
const {
  validateCreatePosts,
  validateUpdatePosts,
} = require("./../uitils/validate");
const cloudinary = require("cloudinary");
const Post = require("../models/postModel");
const catchHandler = require("./../uitils/catchHandler");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");

/**
 * @Create  Posts
 * @Method Post
 * @Route /api/post
 * @Access private user only himself
 */

module.exports.createPosts = catchHandler(async (req, res, next) => {
  // validate image
  // console.log(req.file);
  // if (!req.file) {
  //   return res.status(400).json({
  //     Message: "No image attached!",
  //   });
  // }
  //validate date
  const { error } = validateCreatePosts(req.body);
  if (error) {
    return res.status(400).json({
      Message: error,
    });
  }
  // save photo to cloudinary => not now latter ...!
  // save Data to DB
  console.log(" User", req.body.title);
  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user,
  });

  res.status(201).json({
    data: {
      post,
    },
  });
});

/**
 * @desc  Get Posts
 * @method GET
 * @route /api/post
 * @access public
 */

module.exports.getPosts = catchHandler(async (req, res, next) => {
  const postInPage = 2;
  const { pageNumber, category } = req.query;
  let post;
  console.log(req.query);
  if (pageNumber) {
    post = await Post.find()
      .skip((pageNumber - 1) * postInPage)
      .limit(postInPage)
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else if (category) {
    post = await Post.find(category)
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else {
    post = await Post.find();
    // .sort({ createdAt: -1 })
    // .populate("user", ["-password"]);
  }
  res.status(200).json({
    status: "Success",
    data: {
      post,
    },
  });
});

/**
 * @desc  Get single  Post
 * @method get
 * @route /api/post/:id
 * @access  public
 */
module.exports.getPost = catchHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate("user", ["-password"])
    .populate("comments");
  if (!post) {
    res.status(404).json({
      Message: "Can't find post",
    });
  }
  res.status(200).json({
    data: {
      post,
    },
  });
});

/**
 * @desc  Delete  Posts
 * @method delete
 * @route /api/post/:id
 * @access private (only user and admin)
 */
module.exports.deletePost = catchHandler(async (req, res, next) => {
  console.log(req.params.id);
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(400).json({
      Message: "Can't find post!",
    });
  }

  //req.user is an id for the user
  const user = await User.findById(req.user);

  if (req.user === post.user.toString() || user.role === "admin") {
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ postId: post._id });

    res.status(201).json({
      Message: "Successfully deleted !",
    });
  } else {
    res.status(403).json({
      Message: "You are not authorized to delete Posts!",
    });
  }
});

/**
 * @desc  Update  Posts
 * @method Put
 * @route /api/post/:id
 * @access private (only user )
 */
module.exports.updatePost = catchHandler(async (req, res, next) => {
  const { error } = validateUpdatePosts(req.bode);
  if (error) {
    return res.status(400).json({
      Message: error,
    });
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(400).json({
      Message: "Can't Find Post !",
    });
  }
  console.log(post.user.toString(), "  ", req.user);
  if (req.user !== post.user.toString()) {
    return res.status(403).json({
      Message: "You are not authorized to edit post!",
    });
  }
  const updatePost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    },
    { new: true }
  ).populate("user", ["-password"]);

  res.status(201).json({
    status: "Success",
    date: {
      updatePost,
    },
  });
});

/**
 * @desc  Toggel Likes
 * @method post
 * @route /api/post/:id
 * @access private (only logged in users  )
 *
 */

module.exports.toggelLikes = catchHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);
  const postId = req.params.id;
  const loggedInUser = req.user;
  /** @note post.likes is an array of users id */
  const alreadyLiked = post.likes.find(
    (user) => user.toString() === loggedInUser
  );
  if (alreadyLiked) {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loggedInUser },
      },
      { new: true }
    );
  } else {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loggedInUser },
      },
      { new: true }
    );
  }
  res.status(200).json({
    post,
  });
});
