var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//TODO: add only time for slotTime
var BookingSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref:'User', required: true },
    _vendor: { type: Schema.Types.ObjectId, ref:'Vendor', required: true },
    dateTime: {type:Date, required:true},
    slotTime: {type:Date, required:true},
    bookedThrough: {type:String, required:true, enum:['android','ios','web']}
});

module.exports = mongoose.model('Booking', BookingSchema);