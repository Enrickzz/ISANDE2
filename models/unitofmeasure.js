const mongoose = require('./connection');

const UOMSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    inGrams: {type:String, required: true}
  }

);

const UOMmodel = mongoose.model('uom', UOMSchema, 'unitofmeasure');

exports.getAll = (param, next) => {
  UOMmodel.find({}, (err, uom) => {
    next(err, uom);
  });
};

exports.getByID = function(query, next) {
  UOMmodel.findById(query, function(err, res) {
      next(err, res);
    });
  };