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


