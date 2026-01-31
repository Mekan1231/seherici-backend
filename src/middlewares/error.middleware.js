const AppError = require('../utils/AppError');

const globalErrorHandler = (err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  // Eğer AppError ise → düzenli response
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Bilinmeyen hata
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    },
  });
};

module.exports = globalErrorHandler;
