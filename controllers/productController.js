const productModel = require('../models/products');
const { validationResult } = require('express-validator');

exports.getAllproducts = (param, callback) =>{
    productModel.getAll(param, (err, posts) => {
      if (err) throw err;
      const productObjects = [];
      posts.forEach(function(doc) {
        productObjects.push(doc.toObject());
      });
      callback(productObjects);
    });
  };
exports.getID = (req, res) => {
    var id = req.params.id;
  
    productModel.getByID(id, (err, result) => {
      if (err) {
        throw err;
      } else {
        var prodObject = result.toObject();
        res(prodObject);
      }
    });
  };
