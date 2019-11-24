var userMatrix = require("../models/matrixUserResponse");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
const uuid = require("uuid/v4");

module.exports = {
  addResponse: function(req, res, next) {
    const UserResponseId = req.body.answers;
    const paramData = {
      UserResponseId
    };
    userMatrix
      .addResponse(paramData)
      .then(
        function(result) {
          return res.json({
            result: appResource.success,
            data: { locationID: result.insertId }
          });
        },
        function(err) {
          res.statusCode = config.serverError;
          return res.json({
            result: appResource.serverError,
            statusText: "error"
          });
        }
      )
      .fail(logger.handleError);
  }
};
