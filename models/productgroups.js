const mongoose = require('./connection');

const productgroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    num_products: { type:Number, required:false, default:"0"},
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

exports.createProductGroup = function(obj, next) {
    const pgroup = new productgroupModel(obj);
    pgroup.save(function(err, group) {
      next(err, group);
    });
  };

exports.update = function(id, update, next) {
  productgroupModel.findOneAndUpdate({_id: id}, update, { new: true }, function(err, pgroup) {
    next(err, pgroup);
  })
};

exports.increaseOne = function(id, next) {
  productgroupModel.findOneAndUpdate({_id: id}, {$inc: {num_products: 1} },  function(err, pgroup) {
    next(err, pgroup);
  })
};

exports.decreaseOne = function(id, next) {
  productgroupModel.findOneAndUpdate({_id: id}, {$inc: {num_products: -1} },  function(err, pgroup) {
    next(err, pgroup);
  })
};
exports.remove = function(query, next) {
  productgroupModel.findByIdAndRemove(query, function(err, del){
    next(err, del);
  });
};

// Retrieving just ONE product based on a query (first one)
exports.getOne = function(query, next) {
  productgroupModel.findOne(query, function(err, product) {
    next(err, product);
  });
};

