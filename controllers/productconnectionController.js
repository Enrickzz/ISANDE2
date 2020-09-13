const productconnectionModel = require('../models/productconnection');
const { validationResult } = require('express-validator');
const productModel = require('../models/products');


  exports.getID = (req, res) => {
    var query = req;
    const allConnected = [];
    productconnectionModel.getConnByID({product_groupID: query}, (err, result) => {
      if (err) {
        throw err;
      } 
      result.forEach(function(doc) {
        allConnected.push(doc.toObject());
      });
    res(allConnected);
    });
  };

