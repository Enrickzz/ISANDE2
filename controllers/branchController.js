const branchModel = require('../models/branch');
const { validationResult } = require('express-validator');

exports.getAll = (param, callback) =>{
    branchModel.getAll(param, (err, branches) => {
    if (err) throw err;
    const branchesObj = [];
    branches.forEach(function(doc) {
        branchesObj.push(doc.toObject());
    });
    callback(branchesObj);
  });
};

exports.getID = (req, res) => {
    var id = req.params.id;
  
    branchModel.getByID(id, (err, result) => {
      if (err) {
        throw err;
      } else {
        var branchesObj = result.toObject();
        res( branchesObj);
      }
    });
  };

