
const branchOrderModel = require('../models/branchorder');
const { validationResult } = require('express-validator');

exports.getAll = (param, callback) =>{
    branchOrderModel.getAll(param, (err, branches) => {
    if (err) throw err;
    const branchesObj = [];
    branches.forEach(function(doc) {
        branchesObj.push(doc.toObject());
    });
    console.log(branchesObj);
    callback(branchesObj);
  });
};

exports.getID = (req, res) => {
    var id = req.params.id;
  
    branchOrderModel.getByID(id, (err, result) => {
      if (err) {
        throw err;
      } else {
        var branchesObj = result.toObject();
        res( branchesObj);
      }
    });
  };

  exports.fetchQuery = (req,res) => {
    var query = req;
    branchOrderModel.fetchList({productionorderID: query}, (err, result) => {
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
          console.log("No orders for this branch!");
          res(result);
        }
      }
    })
  }
  exports.addBO = (req, res) =>{
    var POID = "buffer";
    var productname = req.body.productName;
    var qua = req.body.quantity;
    var price = req.body.price;

    var a = parseFloat(qua);
    var b = parseFloat(price);
    var amount = a*b;

    var newBO = {
      productionorderID: POID,
      product: productname,
      quantity: qua,
      rate : price,
      amount: amount
    }
    branchOrderModel.createBO(newBO , function (err, result){
      if (err){
        throw err;
      }else{
        res.redirect('back');
      }
    })
  }
  exports.delete = (req, res) => {
    var id = req.body.BOid;
    branchOrderModel.remove(id, (err, result) => {
      if (err) {
        throw err; 
      } 
      else {
        res.redirect('/productionorder');
      }
    }); 
  };