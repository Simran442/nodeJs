var Q = require("q");
var utility = require("../scripts/utility.js");
var logStack = true;
var _ = require("underscore");

module.exports = {
  getPermissions: function(data) {
    var query = "SELECT id, moduleName, permissionType FROM tblpermissions";
    return utility.query(query, data);
  }
};
