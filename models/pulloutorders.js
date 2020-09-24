const mongoose = require('./connection');

const pulloutorderSchema = new mongoose.Schema({
    FrombranchID: { type: String, required: true },
    TobranchID: { type: String, required: true },
    pulloutdate: { type: String, required: true },
    amount: { type: Number, required:false, default:"0"},
    status: { type: String, required:false, default:"For review"},
  }
);

const pulloutorderModel = mongoose.model('pulloutorder', pulloutorderSchema, 'pulloutorders');

exports.getAll = (param, next) => {
    pulloutorderModel.find({}, (err, res) => {
      next(err, res);
    });
  };

