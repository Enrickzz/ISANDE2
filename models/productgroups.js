const mongoose = require('./connection');

const productgroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    num_products: { type: String, required:true},
    description:{type:String,required:true},
    UOM: { type: String, required:true}
  }
);

const productgroupModel = mongoose.model('productgroups', productgroupSchema);

exports.getAll = (param, next) => {
    productgroupModel.find({}, (err, productgroups) => {
      next(err, productgroups);
    });
  };

exports.getByID = function(query, next) {
    productgroupModel.findById(query, function(err, post) {
      next(err, post);
    });
  };