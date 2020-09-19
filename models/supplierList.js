const mongoose = require('./connection');

const supplierListSchema = new mongoose.Schema(
  {
    supplierID: {type: String, required: true},
    product: {type: String, required: true},
    UOM: {type: String, required: true},
    price: {type: String, required: true}
  }

);


const supplierListModel = mongoose.model('supplierListmodel', supplierListSchema,'supplierList');

exports.getAll = (param, next) => {
    supplierListModel.find({}, (err, pos) => {
      next(err, pos);
    });
  };

  exports.fetchList = function(query, next) {
    supplierListModel.find(query, function(err, suppList) {
      next(err, suppList);
    });
  };