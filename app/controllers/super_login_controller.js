var async = require("async");
var crypto = require("crypto");

var User = require("../models/users");
const validator = require('express-validator');
var events = require('events');
var eventEmitter = new events.EventEmitter();


exports.join = [

    // Validate that the name field is not empty.
    
    validator.body('username', 'username required').trim().isLength({ min: 1 }),
    validator.body('supPassword', 'username required').trim().isLength({ min: 1 }),

    // Sanitize (escape) the name field.
    validator.sanitizeBody('username').escape(),
    validator.sanitizeBody('supPassword').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        
    // Extract the validation errors from a request.
    const errors = validator.validationResult(req);

    // Create a user object with escaped and trimmed data.
    var user  = new User(
        { username: req.body.username,
            password: crypto.createHmac("sha256", "123").update(req.body.supPassword).digest("hex") }
    );


    if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('sJoin', { title: 'You have errors', errors: errors.array()});
        return;
    }
    else {
        // Data from form is valid.
        // Check if username already exists.
        User.findOne({ 'username': req.body.username })
        .exec( function(err, found_username) {
            if (err) { return next(err); }

            if (found_username) {
            // Username exists, return message
            res.render('sJoin', {userNameTaken: "Username already in use"});
            }
            else {

            user.save(function (err) {
                if (err) { return next(err); }
                // User saved. Redirect to join page.
                
                res.render('sJoin', {title: "Join success!"});
                
            });

            }

        });
    }
    }
    ];
  
/****  THIS ONE WORKS for exports.join
(req, res, next) => {
        console.log("JOIN  FUNCTION STARTED");
        var myData = new User(req.body);
        myData.save()
            .then(item => {
                res.send("item saved to database");
            })
            .catch(err => {
                res.status(400).send("unable to save to database")
            });
    };
*/