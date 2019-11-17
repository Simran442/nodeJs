var usersModel = require("../models/users.js");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");

module.exports = {
  addUser: function(req, res, next) {
    console.log("?>>>>User");
    console.log(">>>>>", req.body);
    usersModel
      .addUser(req.body)
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
  },
  getUser: function(req, res, next) {
    console.log("ID>>>>>", req.params);
    if (!req.params.userId) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    usersModel
      .getUser({ userId: req.params.userId })
      .then(
        function(result) {
          return res.json({ result: appResource.success, data: result });
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
  },
  getUsers: function(req, res, next) {
    usersModel
      .getUsers()
      .then(
        function(result) {
          // return res.json({ result: appResource.success, data: result });
          return res.render("users", { result: result });
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
  },
  editUser: function(req, res, next) {
    console.log("req.body>>>>>", req.body);
    if (!req.params.userId) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    if (!req.body) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    usersModel
      .editUser({ ...req.body, userId: parseInt(req.params.userId) })
      .then(
        function(result) {
          return res.json({ result: appResource.success, data: result });
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
  },
  deleteUser: function(req, res, next) {
    if (!req.params.userId) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    usersModel
      .deleteUser({ userId: req.params.userId })
      .then(
        function(result) {
          return res.json({ result: appResource.success, data: result });
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
