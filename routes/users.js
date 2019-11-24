var departmentModel = require("../models/department.js");
var usersModel = require("../models/users.js");
var permissionModel = require("../models/permissions.js");
var timelogmodel = require("../models/timelog");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var passwordHash = require("password-hash");
var uuid = require("uuid");
var configFile = require("../scripts/config.json");
var moment = require("moment");

module.exports = {
  addUser: function(req, res) {
    if (
      !req.body.email ||
      !req.body.password ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.departmentId
    ) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    if (req.body.password.length < 6) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.shortPassword });
    }
    var data = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: passwordHash.generate(req.body.password),
      isActive: true,
      guid: uuid.v4(),
      departmentId: req.body.departmentId
    };
    // data.isActive = false;
    usersModel
      .registerUser(data)
      .then(
        function(result) {
          if (result == config.alreadyExist) {
            res.statusCode = config.alreadyExist;
            return res.json({
              result: appResource.userExists,
              statusText: "error"
            });
          } else if (result == config.notAcceptable) {
            res.statusCode = config.notAcceptable;
            return res.json({
              result: appResource.registeredButInactive,
              statusText: "error"
            });
          } else {
            usersModel.addRoles(result.insertId, []).then(
              function(result) {
                console.log(result);
              },
              function(err) {
                console.log(err);
              }
            );

            usersModel
              .addUserDepartment({
                userId: result.insertId,
                departmentId: req.body.departmentId
              })
              .then(
                function(result) {
                  console.log(result);
                },
                function(err) {
                  console.log(err);
                }
              );

            return res.json({
              result: appResource.successRegister,
              statusText: "success",
              data: data.guid
            });
          }
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
  getUser: function(req, res, next) {
    if (!req.params.userId) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    usersModel
      .getUser({ userId: req.params.userId })
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
  getUsers: function(req, res, next) {
    usersModel
      .getUsers()
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
  editUser: async function(req, res, next) {
    if (!req.params.id || !req.body.email) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    try {
      const { permissionId } = req.body;
      const hasPermission = await usersModel.editUserPermissions({
        id: parseInt(req.params.id),
        permissionId
      });
      const data = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        id: parseInt(req.params.id),
        isActive: parseInt(req.body.isActive)
      };
      const data1 = {
        departmentId: parseInt(req.body.departmentId),
        userId: parseInt(req.params.id)
      };
      const modifyUser = await usersModel.editUser(data);
      const modifyDepartment = await usersModel.editUserDepartment(data1);

      return res.json({
        result: appResource.success,
        data: { result: "success" }
      });
    } catch (err) {
      console.log(err);
      res.statusCode = config.serverError;
      return res.json({
        result: appResource.serverError,
        statusText: "error"
      });
    }
  },

  deleteUser: function(req, res, next) {
    // if (!req.params.id) {
    //   res.statusCode = config.badRequest;
    //   return res.json({ result: appResource.badRequest });
    // }
    usersModel
      .deleteUser({ userId: req.params.id })
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
  adduserPage: async function(req, res) {
    const allDepartments = await departmentModel.getDepartments({});
    res.render("addUserPage", { allDepartments });
  },

  editUserPage: async function(req, res) {
    let departmentpermissions = [];
    let userpermissions = [];
    const permisions = await permissionModel.getPermissions();
    console.log(">>>>PPEERR", permisions);
    Object.keys(permisions).forEach(function(key) {
      if (permisions[key].moduleName === "user") {
        userpermissions.push({
          name: permisions[key].permissionType,
          id: permisions[key].id
        });
      }
      if (permisions[key].moduleName === "department") {
        departmentpermissions.push({
          name: permisions[key].permissionType,
          id: permisions[key].id
        });
      }
    });
    const alldepartment = await departmentModel.getDepartments();
    console.log(">>>>>>>>department", alldepartment);
    usersModel.getUsers({ id: req.params.id }).then(
      function(result) {
        console.log("RESULTTTT>>>", result);
        res.render("editUser", {
          result,
          permisions,
          alldepartment,
          userpermissions,
          departmentpermissions,
          userPermissionsChecked: result[0].permissionId
            ? encodeURIComponent(
                JSON.stringify(result[0].permissionId.split("|"))
              )
            : []
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
  editDataUser: async function(req, res) {
    if (!req.params.id) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    let departmentpermissions = [];
    let userpermissions = [];
    const permisions = await permissionModel.getPermissions();
    var permisionsData = permisions.reduce(function(r, a) {
      r[a.moduleName] = r[a.moduleName] || [];
      r[a.moduleName].push(a);
      return r;
    }, Object.create(null));
    const alldepartment = await departmentModel.getDepartments();
    usersModel.getUsers({ id: req.params.id }).then(
      function(result) {
        if (result.length) {
          return res.json({
            result,
            permisionsData,
            alldepartment,
            userPermissionsChecked: result[0].permissionId
          });
        } else {
          res.statusCode = config.badRequest;
          return res.json({ result: appResource.badRequest });
        }
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
  timelogpage: function(req, res, next) {
    res.render("timelogpage");
  },
  addtimelog: function(req, res, next) {
    if (!req.body.checkInDate) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }

    var StartTime = configFile.startTime;
    var delayedTime =
      moment.duration(req.body.checkInTime).asMinutes() -
      moment.duration(StartTime).asMinutes();
    console.log("DELAYEDD TIME", delayedTime);
    const data = {
      //ToDo change checkindate from backend
      checkInDate: req.body.checkInDate,
      checkInTime: req.body.checkInTime,
      StartTime,
      delayedTime,
      userId: 13,
      isActive: 1
    };
    console.log("DATAAAAAAA", data);
    timelogmodel
      .addtimelog(data)
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
  listUsersPage: function(req, res, next) {
    usersModel
      .getUsers()
      .then(
        function(result) {
          return res.render("users", { result: result });
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

  gettimelog: function(req, res, next) {
    if (!req.params.id) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }

    timelogmodel
      .gettimelog({ id: req.params.id })
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

  editlog: async function(req, res, next) {
    if (!req.params.userId || !req.body.checkOutDate) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    const data = {
      checkOutDate: req.body.checkOutDate,
      userId: parseInt(req.params.userId),
      isActive: 1
    };
    const CheckInData = await timelogmodel.gettimelog();
    console.log("CheckIN>>>>>>", CheckInData);
    if (CheckInData != "" && CheckInData != null && CheckInData != undefined) {
      timelogmodel
        .editlog(data)
        .then(
          function(result) {
            return res.json({ result: appResource.success, data: result });
          },
          function(err) {
            console.log("errr", err);
            res.statusCode = config.serverError;
            return res.json({
              result: appResource.serverError,
              statusText: "error"
            });
          }
        )
        .fail(logger.handleError);
    }
  }

  // getPermissionsDynamic: async function(data) {
  //   var query = "SELECT  DISTINCT moduleName FROM tblpermissions";
  //   const DISTINCT = await utility.query(query, data);
  //   if (DISTINCT.length > 0) {
  //     const mydata = await Promise.all(
  //       DISTINCT.map(async name => {
  //         var query2 =
  //           "SELECT  id,requestType as name  FROM tblpermissions  WHERE moduleName =:name";
  //         const options = await utility.query(query2, {
  //           name: name.moduleName
  //         });
  //         return { [name.moduleName]: options };
  //       })
  //     );
  //     return mydata;
  //   }
  // }
};
