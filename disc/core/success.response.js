"use strict";

const StatusCode = {
   CREATED: 201,
   OK: 200,
};

const ReasonStatusCode = {
   CREATED: "Created",
   OK: "Ok",
};

class SuccessResponse {
   constructor({
      message,
      statusCode = StatusCode.OK,
      reasonStatusCode = ReasonStatusCode.OK,
      metadata = {},
   }) {
      this.message = !message ? reasonStatusCode : message;
      this.status = statusCode;
      this.metadata = metadata;
   }

   send(res, headers = {}) {
      return res.status(this.status).json(this);
   }
}

class CreatedRequestSuccess extends SuccessResponse {
   constructor({
      message,
      statusCode = StatusCode.CREATED,
      reasonStatusCode = ReasonStatusCode.CREATED,
      metadata,
   }) {
      super({ message, statusCode, reasonStatusCode, metadata });
   }
}

class OkRequestSuccess extends SuccessResponse {
   constructor({ message, metadata }) {
      super({ message, metadata });
   }
}

module.exports = {
   CreatedRequestSuccess,
   OkRequestSuccess,
};
