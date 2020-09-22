
const inventoryModel = require('../models/inventory');
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
