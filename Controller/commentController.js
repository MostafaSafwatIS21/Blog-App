const catchHandler = require("../uitils/catchHandler");

const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const {
  validateCreateComment,
  validateUpdateComment,
} = require("../uitils/validate");

/**
 * @create comment
 * @route /api/comment
 * @method post
 * @access private only user logged in
 */
module.exports.createComment = catchHandler(async (req, res, next) => {
  const { error } = validateCreateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const profile = await User.findById(req.user);
  const comment = await Comment.create({
    text: req.body.text,
    postId: req.body.postId,
    user: req.user,
    username: profile.username,
  });
  res.status(201).json({ status: "Success", data: comment });
});

/***************************************Hii******************************************/
/**@get all comments
 * @route /api/comment
 * @method GET
 * @access private only admins
 */

module.exports.getAllComment = catchHandler(async (req, res, next) => {
  const comments = await Comment.find()
    .populate("user")
    .populate("postId");
  res.status(201).json({ status: "Success", data: comments });
});

/**@delete  comments
 * @route /api/comment/:id
 * @method delete
 * @access private only user or admin
 */

module.exports.deleteComment = catchHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  const user = await User.findById(req.user);
  if (req.user === comment.user.toString() || user.role === "admin") {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "Success", message: "Comment deleted" });
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
});
/**
 * @descrie Update  comments
 * @route /api/comment/:id
 * @method put
 * @access private only user
 */
module.exports.updateComment = catchHandler(async (req, res, next) => {
  const { error } = validateUpdateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  if (req.user !== comment.user.toString()) {
    return res
      .status(403)
      .json({ message: "Access denied, user himself can update" });
  }
  const updateComment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        text: req.body.text,
      },
    },
    { new: true }
  )
    .populate("user")
    .populate("postId");
  res.status(201).json({
    status: "Update successfully",
    updatedDate: {
      updateComment,
    },
  });
});
