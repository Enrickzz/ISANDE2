
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

