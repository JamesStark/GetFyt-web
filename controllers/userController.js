var User = require('../models/user');
var config = require('../config/session');
var validator = require('validator');
var jwt = require('jsonwebtoken');

exports.signup = function (req, res, next) {
    if (!validator.isEmail(req.body.email))
        return res.status(422).json({ error: 'Not a valid email' })
    console.log(req.body);
    //check if already present
    User.findOne({ phone: req.body.phone }, function (err, user) {
        if (err) return next(err);
        if (user) return res.status(422).send({ error: 'phone number already in use' });
        User.create({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            gender: req.body.gender,
            password: req.body.password,
            joined_through: req.body.joined_through
        },
            function (err, user) {
                if (err) return next(err);
                console.log(user);
                var token = jwt.sign({ _id: user._id }, config.secret, {
                    expiresIn: '60d'
                });
                return res.json({ auth: true, token: token });
            });
    });

}

exports.login = function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    if (!/^\d{10}$/.test(username)) {
        res.status(400).json({ error: 'Invalid user name' });
    }

    User.findOne({ phone: username }, function (err, user) {
        if (err) return res.status(500).send('Server Error');
        if (!user) return res.status(404).send('No user found.');

        console.log(user);
        var isMatch = user.comparePassword(password);
        if (isMatch) {
            var token = jwt.sign({ _id: user._id }, config.secret, {
                expiresIn: '60d'
            });
            return res.json({ auth: true, token: token });
        }
        else {
            return res.status(401).json({ error: 'Incorrect Password' });
        }
    });
}

exports.authenticate = function (req, res, next) {
    const token = req.body.token || req.query.token || req.headers['token'];
    if (!token) {
        return res.status(201).json({
            message: 'Fatal error, No token available'
        });
    }
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            return res.status(201).json({ message: 'Authentication token expired. Please login again' });
        }
        req.decoded = decoded;
        req.body.userId = decoded._id;
        next();
    });
}