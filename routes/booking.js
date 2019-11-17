var bookingModel = require("../models/booking.js");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");

module.exports = {
  addBooking: function(req, res) {
    var data = {
      locationId: req.body.locationId,
      noOfItems: req.body.noOfItems,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate
    };
    if (
      !data.locationId ||
      !data.noOfItems ||
      !data.checkInDate ||
      !data.checkOutDate
    ) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    bookingModel
      .addBooking(data)
      .then(
        function(result) {
          return res.json({
            result: appResource.success,
            data: { bookingID: result.insertId }
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

  getBookingDetails: function(req, res) {
    if (!req.params.bookingId) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    bookingModel
      .getBookingDetails({ bookingId: req.params.bookingId })
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
  }
};
