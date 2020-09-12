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
//No VALIDATORS 
exports.addProduct = (req,res)=>{
    var product = {
      name: req.body.name,
      sku: req.body.sku,
      stock: "12",
      reorder:"100",
      description: req.body.description,
      UOM: req.body.UOM,
      num_products: "0"
    }
    productModel.createProduct(product, function (err, product_result) {
      if(err){
        console.log(err);
        res.redirect('/allproducts');
      }
      else{
        console.log(product_result);
        res.redirect('/allproducts');
      }
    })
};