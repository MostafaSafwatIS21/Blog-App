const AppError = require("./../uitils/AppError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
module.exports = (err, req, res, next) => {
  // err.statusCode = err.statusCode || 500;
  // err.status = err.status || "error_____________";

  let error = { ...err };

  if (error.name === "CastError") error = handleCastErrorDB(error);

  sendErrorProd(error, res);
};
