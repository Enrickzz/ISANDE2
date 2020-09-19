const branchModel = require('../models/branch');
const { validationResult } = require('express-validator');

exports.getAll = (param, callback) =>{
    branchModel.getAll(param, (err, branches) => {
    if (err) throw err;
    const branchesObj = [];
    branches.forEach(function(doc) {
        branchesObj.push(doc.toObject());
    });
    console.log(branchesObj);
    callback(branchesObj);
  });
};