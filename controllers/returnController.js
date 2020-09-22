
const returnModel = require('../models/returns');
const { validationResult } = require('express-validator');

exports.getAll = (param, callback) =>{
    returnModel.getAll(param, (err, returnList) => {
    if (err) throw err;
    const returnsObk = [];
    returnList.forEach(function(doc) {
        returnsObk.push(doc.toObject());
    });
    console.log(returnsObk);
    callback(returnsObk);
  });
};

exports.getID = (req, res) => {
    var id = req.params.id;
  
    returnModel.getByID(id, (err, result) => {
      if (err) {
        throw err;
      } else {
        var returnObj = result.toObject();
        res( returnObj);
      }
    });
  };

  exports.fetchQuery = (req,res) => {
    var query = req;
    returnModel.fetchList(query, (err, result) => {
      if(err){
        throw err;
      }
      else{
        if(result){
          const returnObj = [];
          result.forEach(function(doc) {
            returnObj.push(doc.toObject());
          });
          res(returnObj);
        }
        else{
          console.log("No returns for this branch!");
          res(result);
        }
      }
    })
  }
