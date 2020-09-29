const mongoose = require('./connection');

const suggestionSchema = new mongoose.Schema({
    date: { type: String, required: true },
    for: { type: String, required: true },//pullout or production
    type: { type: String, required: false },//pullout or production
    tobranch: { type: String, required:false, default:"N/A"},//suggested action for branch
    suggestion: { type: String, required:true},//system will display/store this string
    status: { type: String, required:false, default:"Unresolved"},//"resolved" after actions
  }
);

const suggestionModel = mongoose.model('suggestions', suggestionSchema, 'suggestions');


exports.create = function(obj, next) {
  const createthis = new suggestionModel(obj);
  console.log(createthis);
  createthis.save(function(err, result) {
    console.log(err);
    next(err, result);
  });
};

  exports.getAll = (param, next) => {
    suggestionModel.find({}, (err, ret) => {
      next(err, ret);
    });
  };

  exports.fetchList = function(query, next) {
    suggestionModel.find(query, function(err, ress) {
      next(err, ress);
    });
  };
  exports.delete = function(query, next) {
    suggestionModel.remove(query, function(err, res) {
      next(err, res);
    })
  };