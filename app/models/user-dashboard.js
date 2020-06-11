const dynamoose = require("dynamoose");

var Schema = dynamoose.Schema;

var ProductSchema = new Schema({
    "user_id": String,
    "Age": String,
    "City": String,
    "Gender": String
});

module.exports = dynamoose.model("aandc-dev-ddpm-feature-store-abc123", ProductSchema);