var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
module.exports = {
  dashboard: function(req, res, next) {
    console.log("Dummy");
    res.render("dashboard.hbs");
  }
};
