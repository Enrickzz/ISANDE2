const mongoose = require('./connection');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, required:true},
    num_products: { type: String, required:true},
    stock:{type:String,required:true},
    reorder: { type: String, required:true},
    UOM: { type: String, required:true},
    description:{type:String, requireed:true}
  }
);

const productModel = mongoose.model('product', productSchema);

exports.getAll = (param, next) => {
    productModel.find({}, (err, product) => {
      next(err, product);
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
    console.log(product);
    product.save(function(err, product) {
      console.log(err);
      next(err, product);
    });
  };

