var utility = require('../scripts/utility.js');
var Q = require('q');
var _ = require('underscore');


module.exports = {
    addBooking : function (data) {
        var query = "INSERT INTO bookings(locationId,noOfItems,checkInDate,checkOutDate) VALUES(:locationId,:noOfItems,:checkInDate,:checkOutDate)";
        return utility.query(query, data);
    },
    getBookingDetails: function (data) {
        var query = "SELECT id as bookingId,noOfItems,checkInDate,checkOutDate FROM bookings";
        if (data && data.bookingId) {
            query += " WHERE id = :bookingId";
        }
        return utility.query(query, data);
    }
}