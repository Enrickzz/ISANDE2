const mongoose = require('./connection');

const productrawmaterialSchema = new mongoose.Schema(
  {
    productID: { type: String, required: true },
    name: { type: String, required:true},
    quantity:{type:String,required:true},
    unit:{type:String,required:true},
    cost: { type: String, required:true}
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