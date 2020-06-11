var app = require('../app');
var Product = require("../models/product");
var session = require('express-session');
var DynamoUser = require("../models/user-dashboard");

var async = require("async");

exports.index = function(req, res) {
  async.parallel(
    {
      /*product_count: function(callback) {
        Product.countDocuments({}, callback);
      },*/
      getRecProd: function (callback){
        if (req.personalizeData)  {
          console.log("DATA1", req.personalizeData);
          var pznData = req.personalizeData;
          var pznId1 = pznData.itemList[0].itemId;
          var pznId2 = pznData.itemList[1].itemId;
          var pznId3 = pznData.itemList[2].itemId;
          var pznId4 = pznData.itemList[3].itemId;
          var pznId5 = pznData.itemList[4].itemId;
          var pznId6 = pznData.itemList[5].itemId;
          var recItems;
          
          Product.find({$or:[{"ITEM_ID": pznId1},{"ITEM_ID": pznId2},{"ITEM_ID": pznId3},{"ITEM_ID": pznId4},{"ITEM_ID": pznId5},{"ITEM_ID": pznId6}]}, null, {limit: 6}, function(err, data){
            recItems = data;
            callback(null, recItems);
          });
        } else {
          // Displaying default items
          Product.find({$or:[{"ITEM_ID": 1},{"ITEM_ID": 2},{"ITEM_ID": 3},{"ITEM_ID": 4},{"ITEM_ID": 5},{"ITEM_ID": 6}]}, null, {limit: 6}, function(err, data){
            recItems = data;
            callback(null, recItems);
          });
        }
      },
      getUserInfo: function (callback){
        if(req.query.user_id){
          DynamoUser.query("user_id").eq(req.query.user_id).exec(function(error, results){
            if (error) {
              console.error(error);
            } else {
              callback(null, results);
            }
          });
        } else { 
          callback(null, null);
        }
      }
    },
    function(err, results) {
      if (results) {
        //console.log("RETURNED RESULTS", results);
        res.render("retailIndex2", {
          title: "MY TITLE",
          error: err,
          data: results,
          cartInfo: req.session.cart        
        });
      } else {
      res.render("retailIndex2");
    }
  });
};

exports.products_list = function(req, res, next) {
  Product.find({}, function(err, list_products) {
    if (err) {
      return next(err);
    }
    res.render("retailAllProducts", {
      product_list: list_products,
      cartInfo: req.session.cart
    });
    console.log(list_products);
  });
};

exports.getproduct = function(req, res, next) {
  console.log(req.params.id);
  //console.log("DATA", app.personalizeData);
  Product.find({"ITEM_ID": req.params.id}, function(err, productDetails) {
    console.log(req.params);
    if (err) {
      return next(err);
    }
    res.render("retailProductPage", {
      productDetails: productDetails,
      score: req.personalizeData,
      cartInfo: req.session.cart
    });
    console.log(productDetails);
  });
};

exports.getCart = function(req, res, next) {
    
    res.render("retailCart", {
      cartInfo: req.session.cart,
      otherItems: "HELLO"
    });
};

exports.cartAdd = [
  (req, res, next) => {
    console.log("REQUEST", req.body)
    if (req.session) {
      req.session.cart = req.session.cart || []
      req.session.cart.push(req.body)
    }
    return res.send(req.session)
  }
]

exports.cartClear = [
  (req, res, next) => {
    console.log("REQUEST", req.body)
    if (req.session) {
      req.session.cart =[]
    }
    return res.send(req.session)
  }
]

exports.retailConfirmation = function(req, res, next) {
  req.session.cart =[]
  res.render("retailConfirmation", {
    cartInfo: req.session.cart,
    //TO DO: log this info (i.e. MongoDB or SF to stop duplicate)
    receiptID: Math.round(Math.random() * 100000)
  });
};



/*
let prod = new Product({
  pname: "testThree",
  price: 45,
  availability: "in stock"
});
prod.save();
*/
