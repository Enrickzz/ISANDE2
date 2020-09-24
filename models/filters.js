const mongoose = require('./connection');

const filterSchema = new mongoose.Schema({
    for: { type: String, required: true },
    branch: { type: String, required:true},
    date: { type: String, required:true},
  }
);

const filterModel = mongoose.model('filter', filterSchema, 'inventoryfilter');

exports.fetch= function(query, next) {
    filterModel.findOne(query, function(err, filter) {
      next(err, filter);
    });
  };

  exports.update = function(query, update, next) {
    filterModel.findOneAndUpdate(query, update, { new: true }, function(err, res) {
      next(err, res);
    })
  };