const mongoose = require('./connection');
const { query } = require('express-validator');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, required:false},
    sellingprice: { type: String, required:true},
    stock:{type:String,required:false},
    reorder: { type: String, required:false},
    UOM: { type: String, required:true},
    description:{type:String, requireed:true},
    product_groupID: {type: String, required: false, default:"Ungrouped"}
  }
);

const productModel = mongoose.model('products', productSchema);

exports.getAll = (param, next) => {
    productModel.find({}, (err, product) => {
      next(err, product);
    });
  };

  exports.getProdByID = function(param, next) { //product._id = productID (connection)
    productModel.find(param, function(err, connection) {
        next(err, connection);
    });
};
exports.fetchGrouped = function(query, next) {
  productModel.find(query, function(err, products) {
    next(err, products);
  });
};

exports.getByID = function(query, next) {
    productModel.findById(query, function(err, post) {
      next(err, post);
    });
  };

//for adding products .createProducct // NO CONNECTION TO OTHER DBs YET
exports.createProduct = function(obj, next) {
    const product = new productModel(obj);
    product.save(function(err, product) {
      console.log(err);
      next(err, product);
    });
  };

  exports.update = function(query, update, next) {
    productModel.findOneAndUpdate(query, update, { new: true }, function(err, pgroup) {
      next(err, pgroup);
    })
  };

  exports.updatemany = (query,update, next) => {
    productModel.updateMany(query, update, (err, product) => {
      next(err, product);
    });
  };
  exports.remove = function(query, next) {
    productModel.findByIdAndRemove(query, function(err, del){
      next(err, del);
    });
  };

// Retrieving just ONE product based on a query (first one)
exports.getOne = function(query, next) {
  productModel.findOne(query, function(err, product) {
    next(err, product);
  });
};

