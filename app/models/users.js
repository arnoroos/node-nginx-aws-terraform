var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String,
});

UserSchema.virtual("url").get(function() {
  return "/users/" + this_.id;
});

module.exports = mongoose.model("users", UserSchema);