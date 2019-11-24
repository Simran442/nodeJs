var performanceModel = require("../models/performanceMatrix");
var subperformanceModel = require("../models/subPerformanceMatrix");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
const uuid = require("uuid/v4");

module.exports = {
  getmatrixCalculation: function(req, res, next) {
    res.render("matrixCalculation");
  },
  addcalculation: async function(req, res, next) {
    const submatrix = await performanceModel.getperformances();
    let result = [];
    submatrix.forEach(el => {
      result.push({ matrixId: el.matrixId, name: el.name });
    });
    const submatrix1 = await subperformanceModel.getsubperformances();
    let result1 = [];
    submatrix1.forEach(el => {
      result1.push({ CategoryId: el.CategoryId, names: el.name });
    });
    res.render("addmatrixCalculation", { result, result1 });
  }
};
