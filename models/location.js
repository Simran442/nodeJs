var utility = require('../scripts/utility.js');
var Q = require('q');
var _ = require('underscore');


module.exports = {
    addLocation : function (data) {
        var query = "INSERT INTO locations(locationName,latitude,longitude,cityId) VALUES(:locationName,:latitude,:longitude,:cityId)";
        return utility.query(query, data);
    },
    getLocations: function(data) {
        var query = "SELECT id as locationId, locationName,latitude,longitude FROM locations";
        if (data && data.locationName) {
            query += " WHERE locationName LIKE CONCAT('%',:locationName,'%') ";
        }
        return utility.query(query, data);
    }
}