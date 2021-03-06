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

exports.getGroupProducts = (req,res) => {
  var query = req;
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
        //console.log("No products for this group!");
        res.redirect('/productgroup');
      }
    }
  })
}

exports.addProduct = (req, res) => {
  const errors = validationResult(req);

  const { name, sku, description, UOM, prodgroup, sellingprice} = req.body;
    
    if (errors.isEmpty()) {      
    productModel.getOne({ name: name }, (err, result) => {
      if (result) {
        // found a match, return to login with error
      req.flash('error_msg', 'Product already exists.');
      //   req.session.save( function(){ res.redirect('/'); })
      res.redirect('/allproducts');

      } else {

          const newProduct = {
            name: name,
            sku: sku,
            description: description,
            UOM: UOM,
            product_groupID: prodgroup,
            sellingprice: sellingprice
          };

          productModel.createProduct(newProduct, function (err, product_result) {
            if(err){
              req.flash('error_msg', 'Could not add product. Please try again.');
              result = { success: false, message: "Product was not created!" }
              res.redirect('/allproducts');
            }
            else{
              if(product_result.prodgroup != "Ungrouped"){
                //console.log(product_result);
                req.flash('success_msg', 'Product added.');
                res.redirect('/PGiterate/'+product_result._id);
              }
              else
              {
                req.flash('success_msg', 'Product added.');
                res.redirect('/product/view/'+product_result._id);
              }
              
            }
          })
      }
    });
  } 
  else {
    const messages = errors.array().map((item) => item.msg);

    req.flash('error_msg', messages.join(' '));
    res.redirect('/allproducts'); // making this redirect to / makes req.flash not appear
  }
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
      //console.log(err);
      res.redirect('back');
    }
    else{
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
      //console.log(err);
      res.redirect('back');
    }
    else{
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
      //console.log(err);
      res.redirect('back');
    }
    else{
      res.redirect('/productgroup');
    }
  })
}

exports.delete = (req, res) => {
  var id = req.body.productID;
  var groupid = req.body.groupID;
  productModel.remove(id, (err, result) => {
    if (err) {
      //console.log(err);
      req.flash('error_msg', 'Cannot delete product.');
      res.redirect('/allproducts');
    } 
    else {
      if(result.product_groupID != "Ungrouped"){
        req.flash('success_msg', 'Product deleted.');
        res.redirect('/PGdecrementA/'+groupid);
        
      }
      else{
        req.flash('success_msg', 'Product deleted.');
        res.redirect('/allproducts');
      }
    }
  }); 
};