var locationModel = require('../models/location.js');
var logger = require('../models/logger.js');
var _ = require("underscore");
var Q = require('q');

module.exports = {
  addLocation : function (req,res) {
    var data = {
        locationName: req.body.locationName,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        cityId: req.body.cityId
    }
    if (!data.locationName || !data.latitude || !data.longitude || !data.cityId){
        res.statusCode = config.badRequest;
        return res.json({ result: appResource.badRequest });
    }
    locationModel.addLocation(data).then(function(result){
        return res.json({ result: appResource.success, data: { locationID: result.insertId } });
    },function(err){
        res.statusCode = config.serverError;
        return res.json({ result: appResource.serverError, statusText : "error" });
    }).fail(logger.handleError);
  },
  getLocations: function (req,res) {
    // if (!req.params.locationName){
    //     res.statusCode = config.badRequest;
    //     return res.json({ result: appResource.badRequest });
    // }
    locationModel.getLocations({ locationName: req.params.locationName }).then(function(result){
        return res.json({ result: appResource.success, data: result });
    },function(err){
        res.statusCode = config.serverError;
        return res.json({ result: appResource.serverError, statusText : "error" });
    }).fail(logger.handleError);
  }
}