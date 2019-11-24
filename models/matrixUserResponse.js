var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addResponse: function(data) {
    var query =
      "INSERT INTO performancematrixuserresponse(userId, UserResponseId) VALUES(1, :UserResponseId)";
    return utility.query(query, data);
  }
};
