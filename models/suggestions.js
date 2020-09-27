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



