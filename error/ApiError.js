class ApiError extends Error {
  constructor(status, message, errors = []) {
    super();
    this.status = status;
    this.message = message;
    this.errors = errors;
  }

  static badRequest(m, errors = []) {
    return new ApiError(400, m, errors);
  }

  static UnauthorizedError() {
    return new ApiError(401, "User is not authorized");
  }

  static internal(m) {
    return new ApiError(500, m);
  }

  static forbidden(m) {
    return new ApiError(403, m);
  }
}

module.exports = ApiError;
