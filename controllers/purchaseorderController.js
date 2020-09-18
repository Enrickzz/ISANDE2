const purchaseorderModel = require('../models/purchaseorder');
const { validationResult } = require('express-validator'); 

exports.getAll = (param, callback) =>{
    purchaseorderModel.getAll(param, (err, PO) => {
    if (err) throw err;
    const POobj = [];
    PO.forEach(function(doc) {
        POobj.push(doc.toObject());
    });
    console.log(POobj);
    callback(POobj);
  });
};

