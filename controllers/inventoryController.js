
const inventoryModel = require('../models/inventory');
const branchOrderModel = require('../models/branchorder');
const productionOrderModel = require('../models/productionorder');
const deliveryModel = require('../models/delivery');

const { validationResult } = require('express-validator');

exports.getAll = (param, callback) =>{
    inventoryModel.getAll(param, (err, inventoryList) => {
    if (err) throw err;
    const inventoryObj = [];
    inventoryList.forEach(function(doc) {
        inventoryObj.push(doc.toObject());
    });
    console.log(inventoryObj);
    callback(inventoryObj);
  });
};

exports.getID = (req, res) => {
    var id = req.params.id;
  
    inventoryModel.getByID(id, (err, result) => {
      if (err) {
        throw err;
      } else {
        var inventoryObj = result.toObject();
        res( inventoryObj);
      }
    });
  };

  exports.fetchQuery = (req,res) => {
    var query = req;
    inventoryModel.fetchList(query, (err, result) => {
      if(err){
        throw err;
      }
      else{
        if(result){
          const inventoryfetched = [];
          result.forEach(function(doc) {
            inventoryfetched.push(doc.toObject());
          });
          res(inventoryfetched);
        }
        else{
          console.log("No inventory for this branch!");
          res(result);
        }
      }
    })
  }
exports.midendCountUpdate = (req,res) =>{
  var mid = req.body.midDayCount;
  var end = req.body.endDayCount;
  var id = req.body.id;
  var restocked = req.body.restocked;
  var srp = req.body.srp;
  var runninginv = req.body.changedStock;
  var middaysales = req.body.middaysale;

  if(mid > 0){
    var midtoNum = parseFloat(mid);
    var restockedtoNUm = parseFloat(restocked);
    var srptoNum = parseFloat(srp);
    var middaySale = (restockedtoNUm-midtoNum)*srptoNum;
    var update = {
      $set: {
        midDayCount : mid,
        midDaySales : middaySale,
        runningInventory : mid
      }
    } 
    inventoryModel.update({_id : id}, update, (err,res2) =>{
      if(err){
        throw err;
      }else{
        res.redirect('/inventory-admin');
      }
    })
  }else if(end > 0){
    var endtoNum = parseFloat(end);
    var chngedstock = parseFloat(runninginv);
    var srpfloat = parseFloat(srp);
    var midsales = parseFloat(middaysales);
    
    var enddaySale = ((chngedstock-endtoNum)*srpfloat) + midsales;
    var update = {
      $set: {
        endDayCount : end,
        totsales : enddaySale
      }
    }
    inventoryModel.update({_id : id}, update, (err,res2) =>{
      if(err){
        throw err;
      }else{
        res.redirect('/inventory-admin');
      }
    }) 
  }
}

exports.addInventory = (req,res) =>{
  var prodID = req.body.productionorderID;
  
  productionOrderModel.getByID(prodID, (er, POobj)=>{
    branchOrderModel.fetchList({productionorderID:prodID }, (err, result)=>{
      if (err) {
        res.redirect('back');
      }else{
        result.forEach(function(doc){
          var obj = doc.toObject();

          var inventory ={
            branch_id : POobj.branch,
            inventorydate: POobj.orderDate,
            product: obj.product,
            //startInv: 
            restockQuantity: obj.quantity,
            restockedInventory: 0 + parseFloat(obj.quantity),
            srp: obj.rate
          }
          inventoryModel.create(inventory, (err2,result2)=>{
            if(err2){
              console.log(err2);
              throw err2;
            }
          })
        })
      }
    })
    var delID = req.body.deliveryID;
    var update = {
      $set: {
        status: "Delivered"
      }
    }
    deliveryModel.update({_id: delID},update, (errr, result3)=>{
      if (errr) {
        throw errr;
      }else{
        var status = {
          $set:{
            status:"Completed"
          }
        }
        productionOrderModel.update(prodID,status, (e4,result4)=>{
          if (e4) {
            throw e4;
          }else{
            res.redirect('/inventory-admin');
          }
        })
      }
    })
  })
  
}