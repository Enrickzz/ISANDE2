const mongoose = require('./connection');

const purchaseOrderSchema = new mongoose.Schema(
  {
    supplierID: {type: String, required: true},
    dueDate: {type: String, required: true},
    orderDate: {type: String, required: true},
    shippingAddress: {type: String, required: true},
    status: {type: String, required: true},
    total: {type:String, required: true},
    payable: {type:String, required:true},
    orderMethod:{type:String, required:true}
  }

);

const purchaseOrderModel = mongoose.model('purchaseorder', purchaseOrderSchema,'purchaseorder');

exports.getAll = (param, next) => {
    purchaseOrderModel.find({}, (err, pos) => {
      next(err, pos);
    });
  };

  exports.getByID = function(query, next) {
    purchaseOrderModel.findById(query, function(err, post) {
      next(err, post);
    });
  };