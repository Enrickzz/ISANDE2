const mongoose = require('./connection');

const returnSchema = new mongoose.Schema({
    branchID: { type: String, required: true },
    returndate: { type: String, required: true },
    type: { type: String, required:true},
    amount: { type: Number, required:false, default:"0"},
    status: { type: String, required:false, default:"For review"},
  }
);

const returnModel = mongoose.model('return', returnSchema, 'returns');

exports.getAll = (param, next) => {
    returnModel.find({}, (err, res) => {
      next(err, res);
    });
  };

  exports.getByID = function(query, next) {
    returnModel.findById(query, function(err, post) {
      next(err, post);
    });
  };
exports.fetchList = function(query, next) {
    returnModel.find(query, function(err, res) {
      next(err, res);
    });
  };
  exports.create = function(obj, next) {
    const returns = new returnModel(obj);
    returns.save(function(err, returns) {
      console.log(err);
      next(err, returns);
    });
  };
  exports.increaseTotal = function(id,inc, next) {
    returnModel.findOneAndUpdate({_id: id}, {$inc: {amount: inc} },  function(err, pgroup) {
      next(err, pgroup);
    })
  };
  exports.decreasetotal = function(id,dec, next) {
    returnModel.findOneAndUpdate({_id: id}, {$inc: {amount: -dec} },  function(err, pgroup) {
      next(err, pgroup);
    })
  };
  exports.update = function(query, update, next) {
    returnModel.findOneAndUpdate(query, update, { new: true }, function(err, res) {
      next(err, res);
    })
  };