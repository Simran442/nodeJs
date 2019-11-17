var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addUser: function(data) {
    var query =
      "INSERT INTO users(secondaryId,email,password,deptId,roleId) VALUES(:secondaryId,:email,:password,:deptId,:roleId)";
    return utility.query(query, data);
  },

  getUser: function(data) {
    var query =
      "SELECT id as userId,secondaryId,email,password,roleId,deptId,isActive,lastUpdated,createdOn FROM users";
    if (data && data.userId) {
      query += " WHERE id = :userId";
    }
    console.log("QQQQQQQQ??>>>>", query);
    return utility.query(query, data);
  },
  getUsers: function(data) {
    var query =
      "SELECT id as userId,secondaryId,email,password,roleId,deptId,isActive,lastUpdated,createdOn FROM users";

    console.log("QQQQQQQQ??>>>>", query);
    return utility.query(query, data);
  },

  editUser: function(data) {
    var query = "UPDATE users SET";
    if (data && data.email) {
      query += " email = :email,";
    }
    if (data && data.password) {
      query += " password = :password";
    }
    query += " WHERE id=:userId";
    return utility.query(query, data);
  },

  deleteUser: function(data) {
    var query = "DELETE FROM users WHERE id = :userId";
    return utility.query(query, data);
  }
};
