var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");

module.exports = {
  adduser: function(req, res) {
    console.log("adduser");
    res.render("add");
  }
};
