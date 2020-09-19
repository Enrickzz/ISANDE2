const supplierModel = require('../models/supplier');
const { validationResult } = require('express-validator'); 

exports.getAll = (param, callback) =>{
    supplierModel.getAll(param, (err, suppliers) => {
    if (err) throw err;
    const suppliersObj = [];
    suppliers.forEach(function(doc) {
        suppliersObj.push(doc.toObject());
    });
    console.log(suppliersObj);
    callback(suppliersObj);
  });
};

exports.getID = (req, res) => {
  var id = req;
  console.log(id);
  supplierModel.getByID(id, (err, result) => {
    if (err) {
      throw err;
    } else {
      var supplierObj = result.toObject();
      res(supplierObj);
    }
  });
};
