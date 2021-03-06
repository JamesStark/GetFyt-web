var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var md5 = require('md5');


//TODO: delete points on expiry date

var UserSchema = new Schema({
    name: { required: true, type: String, trim: true, maxlength: 100 },
    phone: {
        required: true,
        type: String,
        trim: true,
        match: [/^\d{10}$/, 'Not a valid mobile number.'],
        maxlength: 10,
        unique: true
    },
    email: { required: true, type: String, trim: true, maxlength: 50 },
    gender: { required: true, type: String, enum: ['male', 'female'] },
    password: { required: true, type: String },
    joined_through: {required:true, type:String, enum:['android','ios','web']},
    joined_on: { type: Date, default: Date.now() },
    isActive: { type: Boolean, default: true },
    points: { type: Number, default: 0 },
    expiry_date: { type: Date }
});

// save hashed password into db
UserSchema.pre('save', function (next) {
    console.log('computing md5 hash');
    const user = this;
    user.password = md5(user.password);
    next();
});

// compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    const password_hash = this.password;
    candidatePassword = md5(candidatePassword);
    if (password_hash == candidatePassword)
        return true
    else 
        return false
};
module.exports = mongoose.model('User', UserSchema);
