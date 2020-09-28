const suggestionsModel = require('../models/suggestions');
const { validationResult } = require('express-validator');

exports.makesuggestions = (req,res)=>{
    var make = req;

    suggestionsModel.create(make, (err, result)=>{
        if(err){
            throw err;
        }else{
            res(result);
        }
    })
}

exports.getAll = (param, callback) =>{
    suggestionsModel.getAll(param, (err, list) => {
    if (err) throw err;
    const listobj = [];
    list.forEach(function(doc) {
        listobj.push(doc.toObject());
    });
    console.log(listobj);
    callback(listobj);
  });
};

exports.fetchQuery = (req,res) => {
    var query = req;
    suggestionsModel.fetchList(query, (err, result) => {
      if(err){
        throw err;
      }
      else{
        if(result){
          const obj = [];
          result.forEach(function(doc) {
            obj.push(doc.toObject());
          });
          res(obj);
        }
        else{
          console.log("No suggestions!");
          res(result);
        }
      }
    })
  }