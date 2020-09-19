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

  console.log("FETCHING PRODUCTS WITH QUERY PRODUCT_GROUPID = " + query);
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
      stock: "0", //data processing by order table
      reorder:"100", //idk if maglalagay tayo ng default reorder pt.
      description: req.body.description,
      UOM: req.body.UOM,
      sellingprice: "0",
      product_groupID: req.body.prodgroup
    }
   
    productModel.createProduct(product, function (err, product_result) {
      if(err){
        console.log(err);
        res.redirect('/allproducts');
      }
      else{
        if(product_result.product_groupID != "Ungrouped"){
          console.log(product_result);
          res.redirect('/PGiterate/'+product_result._id);
        }
        else
        {
          res.redirect('/product/view/'+product_result._id);
        }
        
      }
    })
};


exports.assigngroup = (req, res) => {
  var update ={
    $set: {
      product_groupID: req.body.groupID
    }
  }
  var productID = req.body.productID;
  productModel.update({_id:productID}, update, (err, result) =>{
    if(err){
      console.log("NAGERROR");
      console.log(err);
      res.redirect('back');
    }
    else{
      console.log(result);
      res.redirect('/PGIncrement/'+ req.body.groupID);
    }
  })
}



exports.ungroup = (req, res) => {
  var update ={
    $set: {
      product_groupID: "Ungrouped"
    }
  }
  var productID = req.body.productID;
  productModel.update({_id: productID}, update, (err, result) =>{
    if(err){
      console.log("NAGERROR");
      console.log(err);
      res.redirect('back');
    }
    else{
      console.log(result);
      res.redirect('/PGDecrement/'+ req.body.groupID);
    }
  })
}
exports.ungroupBulk = (req, res) => {
  var update ={
    $set: {
      product_groupID: "Ungrouped"
    }
  }
  var productID = req.body.productID;
  var groupID = req.body.groupID;
  productModel.updatemany({product_groupID: groupID}, update, (err, result) =>{
    if(err){
      console.log("NAGERROR");
      console.log(err);
      res.redirect('back');
    }
    else{
      console.log(result);
      res.redirect('/productgroup');
    }
  })
}

exports.delete = (req, res) => {
  var id = req.body.productID;
  var groupid = req.body.groupID;
  productModel.remove(id, (err, result) => {
    if (err) {
      throw err; 
    } 
    else {
      if(groupid != "Ungrouped"){
        console.log(result);
        res.redirect('/PGdecrementA/'+groupid);
      }
      else{
        res.redirect('/allproducts');
      }
      
    }
  }); 
};