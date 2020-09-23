const mongoose = require('./connection');

const supplierSchema = new mongoose.Schema(
  {
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    company: {type: String, required: true},
    mobileno: {type: String},
    email: {type: String}
  }

);


const supplierModel = mongoose.model('suppliermodel', supplierSchema,'supplier');

exports.getAll = (param, next) => {
    supplierModel.find({}, (err, pos) => {
      next(err, pos);
    });
  };

  exports.getByID = function(query, next) {
    supplierModel.findById(query, function(err, post) {
      next(err, post);
    });
  };

// Retrieving just ONE supplier based on a query (first one)
exports.getOne = function(query, next) {
  supplierModel.findOne(query, function(err, supplier) {
    next(err, supplier);
  });
};

// Saving a supplier given the validated object
exports.register = function(obj, next) {
  const supplier = new supplierModel(obj);
  
  supplier.save(function(err, supplier) {
    next(err, supplier);
  });
}

// Updating a supplier
exports.update = function(_id, query, next) {
  supplierModel.findByIdAndUpdate(_id, query, next);
}