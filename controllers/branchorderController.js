
const branchOrderModel = require('../models/branchorder');
const { validationResult } = require('express-validator');

exports.getAll = (param, callback) =>{
    branchOrderModel.getAll(param, (err, branches) => {
    if (err) throw err;
    const branchesObj = [];
    branches.forEach(function(doc) {
        branchesObj.push(doc.toObject());
    });
    console.log(branchesObj);
    callback(branchesObj);
  });
};

exports.getID = (req, res) => {
    var id = req.params.id;
  
    branchOrderModel.getByID(id, (err, result) => {
      if (err) {
        throw err;
      } else {
        var branchesObj = result.toObject();
        res( branchesObj);
      }
    });
  };

  exports.fetchQuery = (req,res) => {
    var query = req;
    branchOrderModel.fetchList({productionorderID: query}, (err, result) => {
      if(err){
        throw err;
      }
      else{
        if(result){
          const productsfetched = [];
          result.forEach(function(doc) {
            productsfetched.push(doc.toObject());
          });
          res(productsfetched);
        }
        else{
          console.log("No orders for this branch!");
          res(result);
        }
      }
    })
  }
