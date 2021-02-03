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
          //console.log("No orders for this branch!");
          res(result);
        }
      }
    })
  }
  exports.addBO = (req, res) =>{
    var POID = req.session.branch;
    //console.log(req.body)
    var productname = req.body.prod2arr;
    var qua = req.body.qua2arr;
    var price = req.body.price2arr;
    for(var i =0 ; i < productname.length ; i++){
      //console.log(productname[i]);
      var a = parseFloat(qua[i]);
      var b = parseFloat(price[i]);
      var amount = a*b;
      var newBO = {
        productionorderID: POID,
        product: productname[i],
        quantity: qua[i],
        rate : price[i],
        amount: amount,
        actualDelivered: "0"
      }
      if(qua[i] > 0){
        branchOrderModel.createBO(newBO , function (err, result){
          if (err){
            throw err;
          }else{
          }
        })
      }
    }
    res.redirect('back');
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

  exports.update1 =(req,res) => {
    var update = req[0];
    var id = req[1];
    branchOrderModel.update(id, {$set: {systemsuggest: update}}, function (err, change){
        if(err) throw err;
      else{
        res(change);
      }
    })
  }
  exports.updateBO = (req,res) =>{
    var POID = req.body.productionorderid;

    var id = req.body.branchorderid;
    var product = req.body.product;
    var qua = req.body.quantity;
    var rate = req.body.rate;
    var prevtot = req.body.prevTotal;
    var prevamount = req.body.amount;


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