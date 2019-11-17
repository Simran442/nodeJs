global.appResource = require("./scripts/appResource.json");

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mysql = require("mysql");
var handlebars = require("express-handlebars");

var app = express();
var router = express.Router();

// development only
if (app.get("env") == "development") {
  global.config = require("./scripts/config.json");
} else if (app.get("env") == "production") {
  config = require("./scripts/configProd.json");
}

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
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "hbs");

// view engine setup
app.set("views", path.join(__dirname, "/views"));
app.engine(
  "hbs",
  handlebars({
    extname: "hbs",
    layoutsDir: path.join(__dirname, "views"),
    defaultLayout: "",
    partialsDir: [path.join(__dirname, "views")]
  })
);
app.set("view engine", "hbs");

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(router);

// test endpoint
router.get("/", routes.default.index);

// open endpoints
// Locations
router.get("/api/location/:locationName?", routes.location.getLocations);
router.post("/api/location", routes.location.addLocation);

// Bookings
router.get("/api/booking/:bookingId", routes.booking.getBookingDetails);
router.post("/api/booking", routes.booking.addBooking);

//Departments
router.get("/api/department", routes.department.getDepartments);
router.get("/api/department/:deptId", routes.department.getDepartment);
router.post("/api/department", routes.department.addDepartment);
router.patch("/api/department/:deptId", routes.department.editDepartment);
router.delete("/api/department/:deptId", routes.department.deleteDepartment);

//Users
// router.get("/api/users", routes.users.users);
router.get("/api/users", routes.users.getUsers);
router.get("/api/users/:userId", routes.users.getUser);
router.get("/api/adduser", routes.adduser.adduser);
router.post("/api/users", routes.users.addUser);
router.patch("/api/users/:userId", routes.users.editUser);
router.delete("/api/users/:userId", routes.users.deleteUser);

//dummy
router.get("/api/dashboard", routes.dashboard.dashboard);

router.get("*", routes.default.notFound);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


module.exports = app;