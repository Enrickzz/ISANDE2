const mongoose = require('./connection');

const pulloutorderSchema = new mongoose.Schema({
    FrombranchID: { type: String, required: true },
    TobranchID: { type: String, required: true },
    pulloutdate: { type: String, required: true },
    amount: { type: Number, required:false, default:"0"},
    status: { type: String, required:false, default:"For review"},
    item: { type: String, required:false},
    destitem:{ type: String, required:false, default:"override"},
  }
);

const pulloutorderModel = mongoose.model('pulloutorder', pulloutorderSchema, 'pulloutorders');

exports.getAll = (param, next) => {
    pulloutorderModel.find({}, (err, res) => {
      next(err, res);
    });
  };
  exports.fetchList = function(query, next) {
    pulloutorderModel.find(query, function(err, ress) {
      next(err, ress);
    });
  };
exports.getByID = function(query, next) {
    pulloutorderModel.findById(query, function(err, post) {
      next(err, post);
    });
  };
  exports.fetch= (query,next) =>{
    pulloutorderModel.findOne(query, function(err, POO){
        next(err,POO);
    })
}
  exports.create = function(obj, next) {
    const pulloutOrder = new pulloutorderModel(obj);
    console.log(pulloutOrder);
    pulloutOrder.save(function(err, result) {
      console.log(err);
      next(err, result);
    });
  };
  exports.update = function(query, update, next) {
    pulloutorderModel.findOneAndUpdate(query, update, { new: true }, function(err, res) {
      next(err, res);
    })
  };