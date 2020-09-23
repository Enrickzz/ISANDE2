const deliveryModel = require('../models/delivery');
const { validationResult } = require('express-validator');

exports.getAll = (param, callback) =>{
    deliveryModel.getAll(param, (err, branches) => {
    if (err) throw err;
    const deliveryObj = [];
    branches.forEach(function(doc) {
        deliveryObj.push(doc.toObject());
    });
    console.log(deliveryObj);
    callback(deliveryObj);
  });
};

exports.getID = (req, res) => {
    var id = req.params.id;
  
    deliveryModel.getByID(id, (err, result) => {
      if (err) {
        throw err;
      } else {
        var Object = result.toObject();
        res(Object);
      }
    });
  };
