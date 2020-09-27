const mongoose = require('./connection');

const suggestionSchema = new mongoose.Schema({
    date: { type: String, required: true },
    for: { type: String, required: true },
    tobranch: { type: String, required:false, default:"N/A"},
    suggestion: { type: String, required:true},
    status: { type: String, required:false, default:"Unresolved"},
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
