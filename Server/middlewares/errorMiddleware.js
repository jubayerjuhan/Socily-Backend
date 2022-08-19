export const errorMiddleWare = (err, req, res, next) => {
  const errorMessage = err.message || "Internal Server Error";
  const errorCode = err.statusCode || 500;

  res.status(errorCode).json({
    success: false,
    message: errorMessage,
  });
};
