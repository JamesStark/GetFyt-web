var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PurchaseSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref:'User', required: true },
    itemName: { type: String, required: true },
    date: { type: Date, default: Date.now() },
    baseAmt: { type: Number, required: true },
    taxAmt: { type: Number, required: true },
    totAmt: { type: Number, required: true },
    paidThrough: { type: String, enum: ['razorpay', 'paytm', 'ccavenue'], required: true },
    transactionId: { type: String, required: true },
    deviceType: { type: String, enum: ['ios', 'android', 'web'], required: true }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);