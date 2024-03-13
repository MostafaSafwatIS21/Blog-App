const joi = require("joi");

/**@ValidateRegister user models */
function validateRegister(obj) {
  const schema = joi.object({
    username: joi
      .string()
      .required()
      .trim(),
    email: joi
      .string()
      .required()
      .trim()
      .max(100)
      .min(5)
      .email(),
    password: joi
      .string()
      .required()
      .trim(),
    passwordConfirm: joi
      .string()
      .required()
      .trim(),
    bio: joi.string(),
    role: joi.string(),
    isAccountVerifies: joi.boolean(),
    profilePhoto: joi.object(),
  });
  return schema.validate(obj);
}
/**@Validate Login  user model*/
function validateLogin(obj) {
  const schema = joi.object({
    email: joi
      .string()
      .required()
      .trim()
      .email(),
    password: joi
      .string()
      .required()
      .trim(),
    role: joi.string().trim(),
  });
  return schema.validate(obj);
}

/** @validateUpdate user model*/

function validateUpdate(obj) {
  const schema = joi.object({
    username: joi
      .string()
      .trim()
      .min(5)
      .max(30),
    email: joi
      .string()
      .trim()
      .max(100)
      .min(5)
      .email(),
    password: joi.string().trim(),
    bio: joi.string().trim(),
  });
  return schema.validate(obj);
}

/** @create  post model*/
function validateCreatePosts(obj) {
  const schema = joi.object({
    title: joi
      .string()
      .trim()
      .min(5)
      .max(150)
      .required(),
    description: joi
      .string()
      .trim()
      .min(10)
      .required(),
    // user: joi.string().required(),
    category: joi
      .string()
      .required()
      .trim()
      .min(5)
      .max(200),
  });
  return schema.validate(obj);
}
/** @Updata post model*/

function validateUpdatePosts(obj) {
  const schema = joi.object({
    title: joi
      .string()
      .trim()
      .min(5)
      .max(150),
    description: joi
      .string()
      .trim()
      .min(10),
    // user: joi.string().required(),
    category: joi
      .string()
      .trim()
      .min(5)
      .max(200),
  });
  return schema.validate(obj);
}

/**@create comment model */
function validateCreateComment(obj) {
  const schema = joi.object({
    text: joi
      .string()
      .trim()
      .min(5)
      .max(200)
      .required(),
    postId: joi.string().required(),
  });
  return schema.validate(obj);
}
function validateUpdateComment(obj) {
  const schema = joi.object({
    text: joi
      .string()
      .trim()
      .min(5)
      .max(200),
    user: joi.string(),
    postId: joi.string(),
  });
  return schema.validate(obj);
}
module.exports = {
  validateRegister,
  validateLogin,
  validateUpdate,
  validateCreatePosts,
  validateUpdatePosts,
  validateUpdateComment,
  validateCreateComment,
};
