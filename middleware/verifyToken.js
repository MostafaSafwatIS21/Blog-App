const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");

module.exports.verifyToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split(" ")[1];
    try {
      const decodedPaylode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedPaylode.id;
      next();
    } catch (err) {
      return res.status(401).json({
        status: "Failed",
        message: `${err.message} ___________________-`,
      });
    }
  } else {
    return res.status(401).json({
      status: "Failed",
      message: "Please login to get access ",
    });
  }
};

module.exports.verifyAdmin = async (req, res, next) => {
  const id = req.user;
  const user = await User.findById(id);
  console.log("User:", user);
  if (user.role !== "admin") {
    res.status(403).json({
      status: "Failed",
      message: "You are not admin",
    });
  }
  next();
};

module.exports.verifyUserToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({
      status: "Failed",
      message: "Please login to get access ",
    });
  }
  const token = authorization.split(" ")[1];

  const decodedPaylode = jwt.verify(token, process.env.JWT_SECRET);
  const id = decodedPaylode.id;
  if (id !== req.params.id) {
    res.status(403).json({
      status: "Failed",
      message: "only user can update!",
    });
  }
  next();
};

module.exports.Authorization = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({
      status: "Failed",
      message: "Please login to get access ",
    });
  }
  const token = authorization.split(" ")[1];

  const decodedPaylode = jwt.verify(token, process.env.JWT_SECRET);
  const id = decodedPaylode.id;
  const user = await User.findById(id);
  if (id === req.params.id || user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      status: "Failed",
      message: "only user and admin can delete!",
    });
  }
};
