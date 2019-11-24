var RoleModel = require("./role.js");
var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");
var logger = require("./logger.js");

module.exports = {
  registerUser: function(data) {
    var query =
      "INSERT INTO tblusers(guid,firstName,lastName,email,password,isActive,createdOn)";
    query +=
      "VALUES(:guid,:firstName,:lastName,:email,:password,:isActive,now());";

    return utility.query(query, data);
  },
  //Add roles to user
  addRoles: function(userId, roles) {
    var deffered = Q.defer();
    var query = "delete from tbluserrole where userId=:userId";
    utility
      .query(query, { userId: userId })
      .then(
        function(result) {
          if (roles.length > 0) {
            module.exports.insertRoles(userId, roles).then(
              function(r) {
                deffered.resolve(r);
              },
              function(err) {
                deffered.reject(err);
              }
            );
          } else {
            RoleModel.getRoles({ isDefault: true })
              .then(
                function(roles) {
                  console.log(roles, userId);
                  module.exports.insertRoles(userId, roles).then(
                    function(r) {
                      deffered.resolve(r);
                    },
                    function(err) {
                      deffered.reject(err);
                    }
                  );
                },
                function(err) {
                  deffered.reject(err);
                }
              )
              .fail(logger.handleError);
          }
        },
        function(err) {
          deffered.reject(err);
        }
      )
      .fail(logger.handleError);
    return deffered.promise;
  },

  insertRoles: function(userId, roles) {
    var inserted = [];
    var query =
      "Insert into tbluserrole(userId, roleId) Values(:userId, :roleId)";
    var p = [];
    _.each(roles, function(role) {
      var roleId = role.id ? role.id : role;
      console.log(userId, roleId);
      p.push(utility.query(query, { userId: userId, roleId: roleId }));
    });
    return Q.all(p);
  },
  addUserDepartment: function(data) {
    var query =
      "Insert into tbluserdepartment(userId, departmentId) Values(:userId, :departmentId)";
    return utility.query(query, data);
  },
  getUser: function(data) {
    var query = `SELECT users.id as userId, users.secondaryId,users.email,users.password, userPermission.permissionId
    FROM users
    INNER JOIN userPermission
    ON users.id = userPermission.userId`;
    //"SELECT id as userId,secondaryId,email,password,roleId,deptId,isActive,lastUpdated,createdOn FROM users";
    if (data && data.userId) {
      query += " AND users.id= :userId";
    }
    return utility.query(query, data);
  },

  getUsers: function(data) {
    //var query1 = "SELECT u.,d.,td.* FROM tblusers u left join tbluserdepartment d on u.id = d.userId INNER JOIN tblDepartments td on d.departmentId = td.id where u.id =14"
    var query =
      "SELECT u.id, roleId, guid, firstName, lastName, email, password, (Case When isActive=1 Then 1 Else 0 End) AS isActive, up.permissionId, ud.departmentId FROM tblusers u";
    query += " INNER JOIN tbluserrole ur on ur.userId = u.id ";
    query += "LEFT JOIN tbluserpermission up ON u.id = up.userId ";
    query += "LEFT JOIN tbluserdepartment ud ON ud.userId = u.id ";

    if (data && data.email) {
      query += " where email = :email";
    }
    if (data && data.id) {
      query += " where u.id = :id";
    }
    if (data && data.guid) {
      query += " where guid = :guid";
    }

    return utility.query(query, data);
  },

  editUser: function(data) {
    var query = "UPDATE tblusers SET";
    if (data && data.email) {
      query += " email = :email,";
    }
    if (data && data.firstName) {
      query += " firstName = :firstName,";
    }
    if (data && "isActive" in data) {
      query += " isActive = :isActive,";
    }
    if (data && data.lastName) {
      query += " lastName = :lastName";
    }

    query += " WHERE id=:id";
    return utility.query(query, data);
  },

  editUserPermissions: async function(data) {
    var query = "SELECT * from tbluserpermission WHERE userId= :id";
    const hasPermission = await utility.query(query, data);
    // if hasPermission is empty
    if (hasPermission.length <= 0) {
      // insert query
      // return result
      query =
        "INSERT INTO tbluserpermission(userId,permissionId) VALUES(:id,:permissionId)";
      return utility.query(query, data);
    } else {
      // else update query
      // return result
      query =
        "UPDATE tbluserpermission SET permissionId=:permissionId WHERE userId=:id";
      return utility.query(query, data);
    }
  },
  editUserDepartment: async function(data) {
    var query =
      "UPDATE tbluserdepartment SET departmentId=:departmentId WHERE userId=:userId";
    return utility.query(query, data);
  },

  deleteUser: function(data) {
    var query = "UPDATE tblusers SET isActive=0 WHERE id=:userId";
    return utility.query(query, data);
  }
};
