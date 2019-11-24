var subperformanceModel = require("../models/subPerformanceMatrix");
var performanceModel = require("../models/performanceMatrix");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
const uuid = require("uuid/v4");

module.exports = {
  addsubperformance: function(req, res, next) {
    if (!req.body.name) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }

    var data = {
      name: req.body.name,
      isActive: 1,
      guid: uuid.v4(),
      parentId: parseInt(req.body.parentId)
    };
    subperformanceModel
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
  getsubperformances: function(req, res, next) {
    subperformanceModel
      .getsubperformances()
      .then(
        function(result) {
          return res.json({ result: appResource.success, data: result });
          //res.render("submatrix", { result: result });
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
  getsubperformance: function(req, res, next) {
    if (!req.params.id) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    subperformanceModel
      .getsubperformance({ id: req.params.id })
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
  deletesubperformance: function(req, res, next) {
    if (!req.params.id) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    subperformanceModel
      .deletesubperformance({ id: req.params.id })
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
  editsubPerformance: function(req, res, next) {
    if (!req.params.id || !req.body) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    console.log("req.params>>>>", req.params);
    console.log(">>>>>SUB BODY", req.body);
    subperformanceModel
      .editsubPerformance({
        ...req.body,
        id: parseInt(req.params.id)
      })

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
  addsubPerformancePage: async function(req, res, next) {
    const submatrix = await performanceModel.getperformances();
    console.log("SUBMATRIXXX>>", submatrix);
    // let sub = [];
    // submatrix.forEach(el => {
    //   sub.push({ matrixId: el.matrixId, name: el.name });
    // });
    // console.log("IN ROUTE", sub);
    res.render("addsubcategory", { submatrix });
  },
  editSubPerformancePage: async function(req, res) {
    const submatrix = await performanceModel.getperformances();
    console.log("SUBMATRIX >>>>>", submatrix);
    let sub = [];
    submatrix.forEach(el => {
      sub.push({ matrixId: el.id, name: el.name });
    });
    subperformanceModel.getsubperformance({ id: req.params.id }).then(
      function(result) {
        result[0].sub = sub;
        console.log("Result>>>", result);
        console.log("SUBBBBB>>>>", sub);
        return res.render("editCategory", {
          result: result,
          selectedParentCategory: encodeURIComponent(
            JSON.stringify(result[0].parentId)
          )
        });
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
  subperformancePage: function(req, res, next) {
    subperformanceModel
      .getsubperformances()
      .then(
        function(result) {
          //return res.json({ result: appResource.success, data: result });
          res.render("submatrix", { result: result });
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
