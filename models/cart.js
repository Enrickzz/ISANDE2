const mongoose = require('./connection');

const cart = new mongoose.Schema({
    product: { type: String, required: true },
    quantity: { type: String, required:true},
    rate: { type: String, required:true},
    total: { type: String, required:true},
    branch: { type: String, required:false},
    inventoryID:{ type: String, required:false}
  }
);

const cartmodel = mongoose.model('carts', cart, 'cart');

exports.fetchList = function(query, next) {
    cartmodel.find(query, function(err, orders) {
      next(err, orders);
    });
  };

  exports.remove = function(query, next) {
    cartmodel.findByIdAndRemove(query, function(err, del){
      next(err, del);
    });
  };
  exports.removeall = function(query, next) {
    cartmodel.remove(query, function(err, del){
      next(err, del);
    });
  };

  exports.addTocart = function(obj, next) {
    const newcart = new cartmodel(obj);
    newcart.save(function(err, cart) {
      console.log(err);
      next(err, cart);
    });
  };