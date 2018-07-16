var Booking = require('../models/booking');
var User = require('../models/user');
var Slot = require('../models/slot');
var async = require('async');
var Fawn = require('fawn');

exports.make_booking = function (req, res, next) {
    const slotId = req.body.slotId;
    const userId = req.body.userId;
    const sourceType = req.body.sourceType; // android, ios or web
    //TODO: user should book before 1hr
    // check if these params are present

    async.parallel({
        slot: function (callback) {
            Slot.findById(slotId).exec(callback);
        },
        user: function (callback) {
            User.findById(userId).exec(callback);
        }
    }, function (err, results) {
        if (err) return next(err);
        var slot = results.slot;
        var user = results.user;

        if (slot == null || user == null) {
            return res.status(200).send({ error: 'Resource not found' });
        }
        //check if sufficient balance
        if (user.points < slot.points_cost) {
            return res.status(200).send({ error: 'Insufficient points to book this slot' });
        }
        // check slot availability
        if (slot.seats_available === 0) {
            return res.status(200).send({ error: 'Requested slot is not available' });
        }
        /*
         *Book now
         *1)deduct points from user
         *2)update slot availability
         *3)create booking
         */
        console.log(slotId);
        console.log(userId);
        var task = Fawn.Task();
        var cost = slot.points_cost;
        var slot_time = slot.start_time;
        var vendorId = slot._vendor;
        task.update("users", { _id: userId }, { $inc: { points: -cost } })
            .update("slots", { _id: slotId }, { $inc: { seats_available: -1 } })
            .save("bookings", {
                _user: userId,
                _vendor: vendorId,
                dateTime: Date.now(),
                slotTime: slot_time,
                bookedThrough: sourceType,
            })
            .run({useMongoose:true})
            .then(function (results) {
                //TODO: return booking-id
                return res.json({ result: 'booking successful' });
            })
            .catch(function (err) {
                console.log(err);
                return res.json({error:'Booking failed. Please try again'});
            });

    });
};
