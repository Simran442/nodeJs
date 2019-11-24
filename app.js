global.appResource = require("./scripts/appResource.json");

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var auth = require("./scripts/auth");
var logger = require("morgan");
var mysql = require("mysql");
var handlebars = require("express-handlebars");
// var helper = require("ip_backend/helper");
var hbs = require("hbs");
var app = express();
var swaggerUi = require("swagger-ui-express");
var router = express.Router();
var swaggerDocument = require("../ip_backend/swagger.json");

//swagger-API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// development only
if (app.get("env") == "development") {
  global.config = require("./scripts/config.json");
} else if (app.get("env") == "production") {
  config = require("./scripts/configProd.json");
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

global.pool = mysql.createPool({
  host: global.config.dbUrl,
  user: global.config.dbLogin.username,
  port: global.config.dbPort,
  password: global.config.dbLogin.password,
  database: global.config.dbInstance,
  connectionLimit: global.config.dbConnectionLimit,
  multipleStatements: true
});

var routes = require("./routes");

// // view engine setup
// app.set("views",  path.join(__dirname, "views"));
// app.set("view engine", "hbs");

// view engine setup
app.set("views", path.join(__dirname, "/views"));
app.engine(
  "hbs",
  handlebars({
    extname: "hbs",
    layoutsDir: path.join(__dirname, "views"),
    defaultLayout: "",
    partialsDir: [path.join(__dirname, "views")],
    helpers: {
      ifEquals: function(arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
      }
    }
  })
);

app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

auth.setup(app, router);
// app.use(router);
app.use("/", router);

//test endpoint
router.get("/", routes.default.index);

//open endpoints
router.post("/api/user/addUser", routes.users.addUser);

//Locations
router.get("/api/location/:locationName?", routes.location.getLocations);
router.post("/api/location", routes.location.addLocation);

//Bookings
router.get("/api/booking/:bookingId", routes.booking.getBookingDetails);
router.post("/api/booking", routes.booking.addBooking);

//Departments
router.get("/api/department/adddepartment", routes.department.adddepartment);
router.get("/api/department/edit/:id", routes.department.editDepartmentPage);

//router.get("/api/department", routes.department.getDepartments);
router.get("/v1/ui/department", routes.department.listDepartmentPage);
router.get("/api/department/:id", routes.department.getDepartment);
router.post("/api/department", routes.department.addDepartment);
router.patch("/api/department/:id", routes.department.editDepartment);
router.delete("/api/department/:id", routes.department.deleteDepartment);

//For Frontend--------------*******______________________________
router.get("/api/department", routes.department.getDepartments);
router.get("/api/users", routes.users.getUsers);
router.get("/api/users/:id", routes.users.editDataUser);
router.get("/api/Performance", routes.getPerformance.getperformances);
router.get("/api/SubPerformance", routes.subPerformance.getsubperformances);
//-----------------------************_______________________________

//Users
//router.get("/api/users", routes.users.users);
router.get("/api/users/timelog", routes.users.timelogpage);
router.get("/api/users/gettimelog/:id", routes.users.gettimelog);
router.post("/api/user/addtimelog", routes.users.addtimelog);
router.get("/api/users/adduser", routes.users.adduserPage);
router.get("/api/users/editUsers/:id", routes.users.editUserPage);
router.get("/v1/ui/users", routes.users.listUsersPage);
router.get("/api/users/:userId", routes.users.getUser);
//router.get("/api/adduser", routes.adduser.adduser);
//router.get("/api/editUser/:userId", routes.editUser.editUser);
router.post("/api/users", routes.users.addUser);
router.patch("/api/users/:id", routes.users.editUser);

//TODO userID(Timelog)
router.patch("/api/users/editlog/:userId", routes.users.editlog);

router.delete("/api/users/:id", routes.users.deleteUser);

//Permissions
router.get("/api/getPermissions", routes.getPermissions.getPermissions);

//Performance Matrix
router.get(
  "/api/Performance/addperformance",
  routes.getPerformance.addPerformancePage
);
router.get(
  "/api/Performance/edit/:id",
  routes.getPerformance.editPerformancePage
);
router.post("/api/Performance", routes.getPerformance.addperformance);
router.get("/v1/ui/Performance", routes.getPerformance.getperformancePage);
router.get("/api/Performance/:id", routes.getPerformance.getperformance);
router.delete("/api/Performance/:id", routes.getPerformance.deleteperformance);
router.patch("/api/Performance/:id", routes.getPerformance.editPerformance);

//SubCategories
router.get(
  "/api/SubPerformance/addsubperformances",
  routes.subPerformance.addsubPerformancePage
);

router.get(
  "/api/SubPerformance/editt/:id",
  routes.subPerformance.editSubPerformancePage
);
router.post("/api/SubPerformance", routes.subPerformance.addsubperformance);

router.get("/v1/ui/SubPerformance", routes.subPerformance.subperformancePage);
router.get("/api/SubPerformance/:id", routes.subPerformance.getsubperformance);
router.delete(
  "/api/SubPerformance/:id",
  routes.subPerformance.deletesubperformance
);
router.patch(
  "/api/SubPerformance/:id",
  routes.subPerformance.editsubPerformance
);

//API of Matrix Calculations
router.get(
  "/api/matrixCalculation",
  routes.matrixCalculation.getmatrixCalculation
);
router.get(
  "/api/matrixCalculation/addcalculation",
  routes.matrixCalculation.addcalculation
);

//API for User Matrix Response
router.post("/api/userResponse", routes.userResponse.addResponse);

//dummy
router.get("/api/dashboard", routes.dashboard.dashboard);
router.get("*", routes.default.notFound);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
