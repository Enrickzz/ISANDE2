const mongoose = require('./connection');

const requestlistSchema = new mongoose.Schema(
  {
    date: { type: String, required:true},
    type: { type: String, required:true},
    product:{type:String,required:false},
    from:{type:String,required:true},
    cost: { type: String, required:true},
    currInv: { type: String, required:true},
    quantity: { type: String, required:true},
    status:{ type: String, required:false},
  }
);

const requestListModel = mongoose.model('requestlist', requestlistSchema, "requestlist");

exports.getByID = function(query, next) {
    requestListModel.findById(query, function(err, post) {
      next(err, post);
    });
  };
exports.fetch= (query,next) =>{
    requestListModel.find(query, function(err, requests){
        next(err,requests);
    })
}
exports.create = function(obj, next) {
    const savethis = new requestListModel(obj);
    savethis.save(function(err, result) {
      next(err, result);
    });
  };
exports.remove = function(query, next) {
    requestListModel.findByIdAndRemove(query, function(err, del){
      next(err, del);
    });
  };
  exports.update = function(query, update, next) {
    requestListModel.findOneAndUpdate(query, update, { new: true }, function(err, res) {
      next(err, res);
    })
  };