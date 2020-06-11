var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var crypto = require("crypto");
var jsforce = require("jsforce");
var AWS = require("aws-sdk");
var session = require('express-session')


mongoose.Promise = global.Promise;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: 'ABCZYX',
  resave: true,
  rolling: true,
  cookie: { maxAge: 1800 * 1000 }
}))
//test SESSION
app.get('/test', (req, res) => {
  res.send(req.session.test); // 'OK'
});

// AWS Personalize
app.get("", getAWSRecommendations);

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//Set up mongoose connection

var mongoDB =
  //"mongodb+srv://demoUser:Password123@cluster0-mnkla.mongodb.net/test?retryWrites=true&w=majority";
  "mongodb+srv://demoUser:Password123@cluster0-mnkla.mongodb.net/EComm_set?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("connected", function() {
  console.log("MONGOOSE RUNNING");
});

/*
// Connect to Salesforce
var oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
   loginUrl : 'https://ddpmdemo.my.salesforce.com/',
  clientId : '3MVG97quAmFZJfVyn3kjCPMuNs6Rge6KP7QhkIVmcgFYdKa4y_Fj6D8Tpqe63QoyPUfnQ9sGMvwwm_Wa5xon4',
  clientSecret : 'FDCDC9C964824FDF730DD2A1515E1969004815D4201A73A7C6995F50752FEF12',
  redirectUri : 'https://localhost:3000/token'
});
//
// Get authorization url and redirect to it.
//
app.get('/oauth2/auth', function(req, res) {
  res.redirect(oauth2.getAuthorizationUrl({ scope : 'api id web refresh_token' }));
});
*/

AWS.config.update({region:'ap-southeast-2', httpOptions: { timeout: 4000 }});

function getAWSRecommendations(req, res, next){
  console.log("USER-ID:", req.query.user_id);

  if (req.query.user_id){
    var params = {
      campaignArn: 'arn:aws:personalize:ap-southeast-2:107658811397:campaign/campaign_53374',
      numResults: '10',
      userId: req.query.user_id 
    };
  
    var personalizeruntime = new AWS.PersonalizeRuntime();
    personalizeruntime.getRecommendations(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        req.personalizeData = data;
        next();
      }     
    });
  } else {
    console.log("No User ID Query Param");
    next();
  }
}


/////////

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", {myerror : err});
});

module.exports = app;
