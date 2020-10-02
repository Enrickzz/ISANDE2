const mongoose = require('./connection');

const productrawmaterialSchema = new mongoose.Schema(
  {
    productID: { type: String, required: true },
    rawMaterialID: {type:String, required:false},
    name: { type: String, required:true},
    quantity:{type:String,required:true},
    unit:{type:String,required:true},
    cost: { type: String, required:false}
  }
);

const PRMmodel = mongoose.model('PRMmodel', productrawmaterialSchema, "productrawmaterial");

exports.getAll = (param, next) => {
  PRMmodel.find({}, (err, productgroups) => {
      next(err, productgroups);
    });
  };

exports.getByID = function(query, next) {
  PRMmodel.findById(query, function(err, post) {
      next(err, post);
    });
  };

  exports.fetchMaterials = function(query, next) {
    PRMmodel.find(query, function(err, rawmaterial) {
      next(err, rawmaterial);
    });
  };

  exports.saveMaterial = function(obj, next) {
    const rawMaterial = new PRMmodel(obj);
    rawMaterial.save(function(err, save) {
      console.log(err);
      next(err, save);
    });
  };

  exports.update = function(id, update, next) {
    PRMmodel.findOneAndUpdate({_id: id}, update, { new: true }, function(err, pmaterials) {
      next(err, pmaterials);
    })
  };
  exports.remove = function(query, next) {
    PRMmodel.findByIdAndRemove(query, function(err, del){
      next(err, del);
    });
  };

  exports.removeDeletedMaterial = function(query, res) {
    PRMmodel.deleteMany({ rawMaterialID: query}, function(err, del){
      res(del);
    });
  };