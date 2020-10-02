const mongoose = require('./connection');

const productionOrderSchema = new mongoose.Schema(
  {
    orderDate: {type: String, required: true},
    status: {type: String, required: true},
    branch: {type: String, required: true},
    total: {type:Number, required:true}
    }   

);

const productionorderModel = mongoose.model('productionorder', productionOrderSchema,'productionorder');

exports.getAll = (param, next) => {
    productionorderModel.find({}, (err, pos) => {
      next(err, pos);
    });
  };

  exports.getByID = function(query, next) {
    productionorderModel.findById(query, function(err, post) {
      next(err, post);
    });
  };

  exports.fetchList = function(query, next) {
    productionorderModel.find(query, function(err, ress) {
      next(err, ress);
    });
  };

  exports.create = function(obj, next) {
    const purchaseorder = new productionorderModel(obj);
    purchaseorder.save(function(err, purchaseorder_result) {
      console.log(err);
      next(err, purchaseorder_result);
    });
  };

  exports.increasetotal = function(id,inc, next) {
    productionorderModel.findOneAndUpdate({_id: id}, {$inc: {total: inc} },  function(err, pgroup) {
      next(err, pgroup);
    })
  };
  exports.decreasetotal = function(id,dec, next) {
    productionorderModel.findOneAndUpdate({_id: id}, {$inc: {total: -dec} },  function(err, pgroup) {
      next(err, pgroup);
    })
  };

  exports.update = function(id, update, next) {
    productionorderModel.findOneAndUpdate({_id: id}, update, { new: true }, function(err, result) {
      next(err, result);
    })
  };