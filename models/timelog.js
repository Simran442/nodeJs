var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addtimelog: function(data) {
    var query =
      "INSERT INTO tbltimelog(checkInDate,userId,delayedTime, createdOn) VALUES(:checkInDate,:userId,:delayedTime ,now())";
    return utility.query(query, data);
  },
  gettimelog: function(data) {
    var query = "SELECT id, checkInDate, userId FROM tbltimelog";
    if (data && data.id) {
      query += " WHERE id = :id";
    }
    return utility.query(query, data);
  },

  editlog: function(data) {
    console.log(">>>>>DATA", data);
    var query = "UPDATE tbltimelog SET";
    if (data && data.checkOutDate) {
      query += " checkOutDate = :checkOutDate";
    }
    query += " WHERE userid=:userId";
    console.log(">>>>QUERY", query);
    return utility.query(query, data);
  }
};
