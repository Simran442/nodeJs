var departmentModel = require("../models/department.js");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");

module.exports = {
  addDepartment: function(req, res, next) {
    departmentModel
      .addDepartment(req.body)
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

  getDepartment: function(req, res, next) {
    console.log("ID>>>>>", req.params);
    if (!req.params.deptId) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    departmentModel
      .getDepartment({ deptId: req.params.deptId })
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
  getDepartments: function(req, res, next) {
    departmentModel
      .getDepartments()
      .then(
        function(result) {
          console.log("Result>>>", result);
          //return res.json({ result: appResource.success, data: result });
          res.json( { result: result });
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

  editDepartment: function(req, res, next) {
    console.log("req.body>>>>>", req.body);
    if (!req.params.deptId) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    if (!req.body) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    departmentModel
      .editDepartment({ ...req.body, deptId: parseInt(req.params.deptId) })
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

  deleteDepartment: function(req, res, next) {
    if (!req.params.deptId) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    departmentModel
      .deleteDepartment({ deptId: req.params.deptId })
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
