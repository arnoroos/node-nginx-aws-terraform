var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  item_title: String,
  price: String,
  img_name: String,
  ITEM_ID: String,
  category: String,
  sub_category: String
});

//***** Revisit This */
ProductSchema.virtual("url").get(function() {
  return "/products/" + this.ITEM_ID;
});
//******** */

module.exports = mongoose.model("cc_products", ProductSchema);
