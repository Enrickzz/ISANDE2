const productionorderModel = require('../models/productionorder');
const branchOrderModel = require('../models/branchorder');
const deliveryModel = require('../models/delivery'); 
const { validationResult } = require('express-validator');
const { parse } = require('handlebars');

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
    var POID = req.session.branch;
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

  exports.updateBO = (req,res) =>{
    var POID = req.body.productionorderid;

    var id = req.body.branchorderid;
    var product = req.body.product;
    var qua = req.body.quantity;
    var rate = req.body.rate;
    var prevtot = req.body.prevTotal;
    var prevamount = req.body.amount;
    console.log("BO: "+ id);


          var a = parseFloat(qua);
          var b = parseFloat(rate);
          var newamount = (a*b);
          
          var newBO = {
            productionorderID: POID,
            product: product,
            quantity: qua,
            rate : rate,
            amount: newamount
          }
  
          branchOrderModel.update(id, newBO ,function (err, counted){
            if(err){
              throw err;
            }
            else{
              console.log(counted);
              var newtotal = parseFloat(prevtot) - parseFloat(prevamount) + parseFloat(newamount); // PO total - amountBeforeUpdate + newAmount
              var update = {
                $set:{
                  total: newtotal
                }
              }
              productionorderModel.update(POID, update ,(error2,success2) =>{
                if(error2){
                  throw error2;
                }else{
                  
                }
              })
              // This increments the total every update :< 
            }
          })

            var update ={
              $set:{
                status: "In Transit"
              }
            }
            deliveryModel.update({productionID: POID}, update, (error, success)=>{
              if (error) {
                throw error;
              }else{
                res.redirect('/productionorder/view/'+POID);
              }
            })

  }