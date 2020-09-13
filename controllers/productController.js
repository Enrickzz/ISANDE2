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
    console.log(req);
    console.log(id);
    productModel.getByID(id, (err, result) => {
      if (err) {
        throw err;
      } else {
        var prodObject = result.toObject();
        res(prodObject);
      }
    });
  };

exports.getGroupProducts = (req,res) => {
  var query = req;

  console.log("find products by group ID : " + query);
  productModel.fetchGrouped({product_groupID: query}, (err, result) => {
    if(err){
      throw err;
    }
    else{
      if(result){
        const productsfetched = [];
        result.forEach(function(doc) {
          productsfetched.push(doc.toObject());
        });
        res(productsfetched);
      }
      else{
        console.log("No products for this group!");
        res.redirect('/productgroup');
      }
    }
  })

}


//No VALIDATORS 
exports.addProduct = (req,res)=>{
    var product = {
      name: req.body.name,
      sku: req.body.sku,
      stock: "12",
      reorder:"100",
      description: req.body.description,
      UOM: req.body.UOM,
      num_products: "0",
      product_groupID: "Ungrouped"
    }
    
    productModel.createProduct(product, function (err, product_result) {
      if(err){
        console.log(err);
        res.redirect('/allproducts');
      }
      else{
        console.log(product_result);
        res.redirect('/allproducts')
      }
    })
};