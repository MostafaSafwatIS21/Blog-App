const catchHandler = require("./../uitils/catchHandler");
const bcrypt = require("bcryptjs");
const User = require("./../models/userModel");
const { validateRegister, validateLogin } = require("./../uitils/validate");
const jwt = require("jsonwebtoken");
/**
 * @desctiption Register-NEW-user
 * @Router /api/user/register
 * @Method POST
 * @Access public
 */

const siginToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**@Register */
module.exports.register = catchHandler(async (req, res, next) => {
  const { error } = validateRegister(req.body);
  if (error) {
    return res.status(400).json({
      Status: "Fail",
      message: error,
    });
  }
  let user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.status(400).json({
      Status: "Fail",
      message: "Eamil already exist",
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const passwordConfirm = await bcrypt.compare(
    req.body.passwordConfirm,
    hashedPassword
  );
  if (!passwordConfirm) {
    return res.status(400).json({
      Status: "Fail",
      message: "Please confirm your password correctly",
    });
  }
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role || "user",
    bio: req.body.bio || "XXXXXX",
  });

  await user.save();
  res.status(201).json({
    status: "Succeccfully",
    data: {
      user,
    },
  });
});

/**
 * @desctiption Login
 * @Router /api/user/login
 * @Method POST
 * @Access public
 */

/** @generateToken */

module.exports.login = catchHandler(async (req, res, next) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({
      Status: "Fail",
      message: error,
    });
  }
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({
      Status: "Fail",
      message: "Password or Email not correct!",
    });
  }
  const passwordHashesCheack = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!passwordHashesCheack) {
    return res.status(400).json({
      Status: "Fail",
      message: "Password or Email not correct!",
    });
  }

  const token = siginToken(user._id);

  res.status(200).json({
    status: "Succeccfully",
    message: `Welcome ${user.username} to our website!`,
    token,
  });
});
