const mongoose = require('./connection');

const allRawMaterialsSchema = new mongoose.Schema(
  {
    name: { type: String, required:true},
    stock:{type:String,required:false},
    UOM:{type:String,required:true},
    costperUnit: { type: String, required:true}
  }
);

const rawMaterialModel = mongoose.model('rawMaterialModel', allRawMaterialsSchema, "materialList");

exports.getAll = (param, next) => {
    rawMaterialModel.find({}, (err, productgroups) => {
      next(err, productgroups);
    });
  };

exports.getByID = function(query, next) {
    rawMaterialModel.findById(query, function(err, post) {
      next(err, post);
    });
  };

  exports.fetchMaterials = function(query, next) {
    rawMaterialModel.find(query, function(err, rawmaterial) {
      next(err, rawmaterial);
    });
  };

  exports.saveMaterial = function(obj, next) {
    const rawMaterial = new rawMaterialModel(obj);
    console.log(rawMaterial);
    rawMaterial.save(function(err, save) {
      console.log(err);
      next(err, save);
    });
  };