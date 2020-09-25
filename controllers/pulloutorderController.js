
const pulloutorderModel = require('../models/pulloutorders');
const { validationResult } = require('express-validator');
const returnItemsModel = require('../models/returnitems');
const inventoryModel = require('../models/inventory');

exports.getAll = (param, callback) =>{
    pulloutorderModel.getAll(param, (err, pulloutorderList) => {
    if (err) throw err;
    const pulloutsObk = [];
    pulloutorderList.forEach(function(doc) {
        pulloutsObk.push(doc.toObject());
    });
    console.log(pulloutsObk);
    callback(pulloutsObk);
  });
};

exports.getID = (req, res) => {
  var id = req.params.id;

  pulloutorderModel.getByID(id, (err, result) => {
    if (err) {
      throw err;
    } else {
      var pulloutObj = result.toObject();
      res( pulloutObj);
    }
  });
};

