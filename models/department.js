var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addDepartment: function(data) {
    var query =
      "INSERT INTO department(deptName,shortCode,deptDesc,secondaryId) VALUES(:deptName,:shortCode,:deptDesc,:secondaryId)";
    return utility.query(query, data);
  },
  getDepartment: function(data) {
    var query =
      "SELECT id as deptId,deptName,shortCode,deptDesc,secondaryId,isActive, lastUpdated, createdOn FROM department";
    if (data && data.deptId) {
      query += " WHERE id = :deptId";
    }
    return utility.query(query, data);
  },
  getDepartments: function(data) {
    var query =
      "SELECT deptId,deptName,shortCode,deptDesc,secondaryId,isActive, lastUpdated, createdOn FROM department";
    return utility.query(query, data);
  },

  editDepartment: function(data) {
    var query = "UPDATE department SET";
    if (data && data.deptName) {
      query += " deptName = :deptName,";
    }
    if (data && data.deptDesc) {
      query += " deptDesc = :deptDesc";
    }
    if (data && data.shortCode) {
      query += " shortCode = :shortCode";
    }
    query += " WHERE id=:deptId";
    return utility.query(query, data);
  },

  deleteDepartment: function(data) {
    var query = "DELETE FROM department WHERE id = :deptId";
    return utility.query(query, data);
  }
};
