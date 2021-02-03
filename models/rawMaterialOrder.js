const mongoose = require('./connection');

const rawMaterialOrderSchema = new mongoose.Schema(
  {
    purchaseorderID: { type: String, required:true},
    product:{type:String,required:false},
    quantity:{type:String,required:true},
    uom: { type: String, required:true},
    supplyprice: { type: String, required:true},
    subtotal: { type: String, required:true}
  }
);

const rawMaterialOrderModel = mongoose.model('rawMaterialOrderModel', rawMaterialOrderSchema, "rawmaterialOrder");

exports.getAll = (param, next) => {
    rawMaterialOrderModel.find({}, (err, productgroups) => {
      next(err, productgroups);
    });
  };

exports.getByID = function(query, next) {
    rawMaterialOrderModel.findById(query, function(err, post) {
      next(err, post);
    });
  };

  exports.fetch = function(query, next) {
    rawMaterialOrderModel.find(query, function(err, rawmaterial) {
      next(err, rawmaterial);
    });
  };

  exports.saveMaterial = function(obj, next) {
    const rawMaterial = new rawMaterialOrderModel(obj);
    rawMaterial.save(function(err, save) {
      next(err, save);
    });
  };

  
  exports.remove = function(query, next) {
    rawMaterialOrderModel.findByIdAndRemove(query, function(err, del){
      next(err, del);
    });
  };