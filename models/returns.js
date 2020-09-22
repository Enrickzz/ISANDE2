const mongoose = require('./connection');

const returnSchema = new mongoose.Schema({
    returndate: { type: String, required: true },
    type: { type: String, required:true},
    amount: { type: String, required:false, default:"0"},
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

exports.update = function(query, update, next) {
    returnModel.findOneAndUpdate(query, update, { new: true }, function(err, res) {
    next(err, res);
  })
};

