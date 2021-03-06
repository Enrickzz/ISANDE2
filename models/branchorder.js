const mongoose = require('./connection');

const branchOrderSchema = new mongoose.Schema({
    productionorderID: { type: String, required: true },
    product: { type: String, required:true},
    quantity: { type: String, required:true},
    actualDelivered: { type: String, required:false, default:"0"},
    rate: { type: String, required:true},
    amount: { type: String, required:true},
    systemsuggest: {type: String, required:false, default:"0"},
    
  }
);

const branchOrderModel = mongoose.model('branchorders', branchOrderSchema, 'branchorder');

exports.fetchList = function(query, next) {
    branchOrderModel.find(query, function(err, orders) {
      next(err, orders);
    });
  };

  exports.createBO = function(obj, next) {
    const BO = new branchOrderModel(obj);
    BO.save(function(err, BO) {
      next(err, BO);
    });
  };

  exports.update = function(query, update, next) {
    branchOrderModel.findByIdAndUpdate(query, update, function(err, done) {
      next(err, done);
    })
  };
  exports.remove = function(query, next) {
    branchOrderModel.findByIdAndRemove(query, function(err, del){
      next(err, del);
    });
  };

  exports.updateOne = function(query, update, next) {
    branchOrderModel.findOneAndUpdate(query, update, function(err, res) {
      next(err, res);
    })
  };