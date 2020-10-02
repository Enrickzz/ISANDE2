const UOMmodel = require('../models/unitofmeasure');
const { validationResult } = require('express-validator'); 

exports.getAll = (param, callback) =>{
    UOMmodel.getAll(param, (err, units) => {
    if (err) throw err;
    const unitObj = [];
    units.forEach(function(doc) {
      unitObj.push(doc.toObject());
    });
    callback(unitObj);
  });
};

