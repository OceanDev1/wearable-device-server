"use strict";

const StatusCode = {
   FORBIDDEN: 403,
   CONFLICT: 409,
   INTERNAL: 500,
};

const ReasonStatusCode = {
   FORBIDDEN: "Bad request error",
   CONFLICT: "Conflict error",
   INTERNAL: "Internal Error Server",
};

class ErrorResponse extends Error {
   constructor(message, status) {
      super(message);
      this.status = status;
   }
}

class ConflictRequestError extends ErrorResponse {
   constructor(
      message = ReasonStatusCode.CONFLICT,
      statusCode = StatusCode.FORBIDDEN
   ) {
      super(message, statusCode);
   }
}

class BadRequestError extends ErrorResponse {
   constructor(
      message = ReasonStatusCode.CONFLICT,
      statusCode = StatusCode.FORBIDDEN
   ) {
      super(message, statusCode);
   }
}

class ServerRequestError extends ErrorResponse {
   constructor(
      message = ReasonStatusCode.INTERNAL,
      statusCode = StatusCode.INTERNAL
   ) {
      super(message, statusCode);
   }
}
module.exports = {
   ConflictRequestError,
   BadRequestError,
};
