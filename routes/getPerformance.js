var performanceModel = require("../models/performanceMatrix");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var uuid = require("uuid");

module.exports = {
  addperformance: function(req, res, next) {
    if (!req.body.name || !req.body.percentage) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    var data = {
      name: req.body.name,
      isActive: 1,
      guid: uuid.v4(),
      percentage: req.body.percentage
    };
    performanceModel
      .addperformance(data)
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
  getperformances: function(req, res, next) {
    performanceModel
      .getperformances()
      .then(
        function(result) {
          // console.log(">>>>>RES", result);
          //res.render("matrix", { result: result });
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
  getperformance: function(req, res, next) {
    if (!req.params.matrixId) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    performanceModel
      .getperformance({ matrixId: req.params.id })
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
  deleteperformance: function(req, res, next) {
    if (!req.params.id) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    performanceModel
      .deleteperformance({ id: req.params.id })
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
  editPerformance: function(req, res, next) {
    if (!req.params.id || !req.body.name) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    console.log("?>>>>>ACTIVE", req.body);
    performanceModel
      .editPerformance({ ...req.body, id: parseInt(req.params.id) })
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
  addPerformancePage: function(req, res, next) {
    res.render("addperformance");
  },
  editPerformancePage: function(req, res) {
    performanceModel.getperformance({ id: req.params.id }).then(
      function(result) {
        return res.render("editPerformance", { result });
      },

      function(err) {
        res.statusCode = config.serverError;
        return res.json({
          result: appResource.serverError,
          statusText: "error"
        });
      }
    );
  },
  getperformancePage: function(req, res, next) {
    performanceModel
      .getperformances()
      .then(
        function(result) {
          // console.log(">>>>>RES", result);
          res.render("matrix", { result: result });
          //return res.json({ result: appResource.success, data: result });
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
