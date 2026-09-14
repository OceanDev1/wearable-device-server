"use strict";

const { OkRequestSuccess } = require("./../core/success.response");
const readingService = require("./../services/reading.services");

class ReadingControllers {
  getDataFirst = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await readingService.getDocumentDataFirst(
        req.query
      ),
    }).send(res);
  };
}

module.exports = new ReadingControllers();
