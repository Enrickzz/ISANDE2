const mongoose = require('./connection');

const purchaseOrderSchema = new mongoose.Schema(
  {
    supplier: {type: String, required: true},
    dueDate: {type: String, required: true},
    orderDate: {type: String, required: true},
    shippingaddress: {type: String, required: true, default: "48 Burgos St., Lingayen"},
    status: {type: String, required: true},
    total: {type:Number, required: true},
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


  exports.createPurchaseOrder = function(obj, next) {
    const purchaseorder = new purchaseOrderModel(obj);
    console.log(purchaseorder);
    purchaseorder.save(function(err, purchaseorder_result) {
      console.log(err);
      next(err, purchaseorder_result);
    });
  };

  exports.increasetotal = function(id,inc, next) {
    purchaseOrderModel.findOneAndUpdate({_id: id}, {$inc: {total: inc} },  function(err, pgroup) {
      next(err, pgroup);
    })
  };
  exports.decreasetotal = function(id,dec, next) {
    purchaseOrderModel.findOneAndUpdate({_id: id}, {$inc: {total: -dec} },  function(err, pgroup) {
      next(err, pgroup);
    })
  };

  exports.update = function(id, update, next) {
    purchaseOrderModel.findOneAndUpdate({_id: id}, update, { new: true }, function(err, result) {
      next(err, result);
    })
  };