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

// //No VALIDATORS 
// exports.addProduct = (req,res)=>{
//     var product = {
//       name: req.body.name,
//       sku: req.body.sku,
//       description: req.body.description,
//       UOM: req.body.UOM,
//       sellingprice: req.body.sellingprice,
//       product_groupID: req.body.prodgroup
//     }
   
//     productModel.createProduct(product, function (err, product_result) {
//       if(err){
//         console.log(err);
//         res.redirect('/allproducts');
//       }
//       else{
//         if(product_result.product_groupID != "Ungrouped"){
//           console.log(product_result);
//           res.redirect('/PGiterate/'+product_result._id);
//         }
//         else
//         {
//           res.redirect('/product/view/'+product_result._id);
//         }
        
//       }
//     })
// };

exports.addProduct = (req, res) => {
  const errors = validationResult(req);

  const { name, sku, description, UOM, prodgroup, sellingprice} = req.body;
    
    if (errors.isEmpty()) {      
    productModel.getOne({ name: name }, (err, result) => {
      if (result) {
        console.log("Product already exists!");
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
              console.log(err.errors);
              result = { success: false, message: "Product was not created!" }
              res.redirect('/allproducts');
            }
            else{
              if(product_result.prodgroup != "Ungrouped"){
                console.log(product_result);
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
      console.log(err);
      req.flash('error_msg', 'Cannot delete product.');
      res.redirect('/allproducts');
    } 
    else {
      if(result.product_groupID != "Ungrouped"){
        console.log(result);
        // res.redirect('/PGdecrementA/'+groupid); 
        // this causes error in redirect
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