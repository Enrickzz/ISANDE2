const mongoose = require('./connection');

const sales = new mongoose.Schema({
    subtotal: { type: String, required: true },
    tax: { type: String, required:true},
    discount: { type: String, required:false},
    total: { type: String, required:true},
    date: { type: String, required:true},
    staffincharge: { type: String, required:true},
    paid: { type: String, required:true},
    change: { type: String, required:true},
    branch:{type: String, required:true}
  }
);

const salesmodel = mongoose.model('sales', sales, 'sale');

exports.getByID = function(query, next) {
  salesmodel.findById(query, function(err, post) {
    next(err, post);
  });
};

exports.fetchList = function(query, next) {
    salesmodel.find(query, function(err, orders) {
      next(err, orders);
    });
  };

  exports.remove = function(query, next) {
    salesmodel.findByIdAndRemove(query, function(err, del){
      next(err, del);
    });
  };
  exports.removeall = function(query, next) {
    salesmodel.remove(query, function(err, del){
      next(err, del);
    });
  };

  exports.saveSale = function(obj, next) {
    const newsale = new salesmodel(obj);
    newsale.save(function(err, cart) {
      next(err, cart);
    });
  };