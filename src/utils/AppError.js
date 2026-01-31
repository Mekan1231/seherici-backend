class AppError extends Error {
  constructor(message, statusCode = 400, code = null) {
    super(message);

    this.statusCode = statusCode; // HTTP Code
    this.code = code;             // Application internal code, like PHONE_ALREADY_EXISTS
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
