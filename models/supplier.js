const mongoose = require('./connection');

const supplierSchema = new mongoose.Schema(
  {
    company: {type: String, required: true},
    contactperson: {type: String, required: true},
    mobile: {type: String, required: true},
    email: {type: String, required: true}
  }

);


const supplierModel = mongoose.model('suppliermodel', supplierSchema,'supplier');

exports.getAll = (param, next) => {
    supplierModel.find({}, (err, pos) => {
      next(err, pos);
    });
  };