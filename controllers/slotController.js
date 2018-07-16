var Pass = require('../models/slot');

var async = require('async');

exports.slot_list = function(req, res, next){
    Pass.find({_vendor:req.query.vendorId},
        '_id date start_time end_time is_available')
        .exec(function(err, passList){
            if(err) return next(err);
            return res.json(passList);
        });
};