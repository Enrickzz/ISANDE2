const mongoose = require('./connection');

const returnItemsSchema = new mongoose.Schema({
    branchID: { type: String, required: true },
    returnID: { type: String, required: true },
    product: { type: String, required:true},
    unit: { type: String, required:false, default:"0"},
    quantity: { type: String, required:false, default:"0"},
    sellingprice: { type: String, required:false, default:"0"},
    amount: { type: String, required:false, default:"0"},
  }
);

const returnitemsModel = mongoose.model('returnitem', returnItemsSchema, 'returnitems');

exports.getAll = (param, next) => {
    returnitemsModel.find({}, (err, res) => {
      next(err, res);
    });
  };

  exports.getByID = function(query, next) {
    returnitemsModel.findById(query, function(err, post) {
      next(err, post);
    });
  };
exports.fetchList = function(query, next) {
    returnitemsModel.find(query, function(err, res) {
      next(err, res);
    });
  };

exports.update = function(query, update, next) {
    returnitemsModel.findOneAndUpdate(query, update, { new: true }, function(err, res) {
    next(err, res);
  })
};
exports.create = function(obj, next) {
    const returnitem = new returnitemsModel(obj);
    returnitem.save(function(err, returnitem) {
      next(err, returnitem);
    });
  };
  exports.remove = function(query, next) {
    returnitemsModel.findByIdAndRemove(query, function(err, del){
      next(err, del);
    });
  };