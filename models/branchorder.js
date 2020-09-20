const mongoose = require('./connection');

const branchOrderSchema = new mongoose.Schema({
    productionorderID: { type: String, required: true },
    product: { type: String, required:true},
    quantity: { type: String, required:true},
    rate: { type: String, required:true},
    amount: { type: String, required:true},
  }
);

const branchOrderModel = mongoose.model('branchorders', branchOrderSchema, 'branchorder');

exports.fetchList = function(query, next) {
    branchOrderModel.find(query, function(err, orders) {
      next(err, orders);
    });
  };