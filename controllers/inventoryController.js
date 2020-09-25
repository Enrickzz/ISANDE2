
const inventoryModel = require('../models/inventory');
const branchOrderModel = require('../models/branchorder');
const productionOrderModel = require('../models/productionorder');
const deliveryModel = require('../models/delivery');
const requestModel = require('../models/requestlist');
const pulloutModel = require('../models/pulloutorders');

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
      if(err){
        res.redirect('back');
      }else{
        var curr = POobj.orderDate;
        var todate = new Date(curr);
        todate.setDate(todate.getDate()-1)
        var dd = String(todate.getDate()).padStart(2, '0');
        var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = todate.getFullYear();
        todate = yyyy + '-' + mm + '-' + dd;
        console.log(todate);
        inventoryModel.fetchList({inventorydate: "" + todate , branch_id: POobj.branch}, (error, prevdayInv)=>{
          if (error) {
            console.log(error);
            res.redirect('back');
          }else{
            var counter2 =0;
            prevdayInv.forEach(function(doc){
              var prev = doc.toObject();
              var obj;
              var checker = 0;
              checker = 0;
              result.forEach(function(doc2){
                obj = doc2.toObject();
                var restockedInv = parseFloat(obj.quantity);
                var prevenddayCount ="0";
                //console.log(prevdayInv.length +"  " + checker);
                if(obj.product == prev.product){
                  var a = parseFloat(obj.quantity) + parseFloat(prev.endDayCount);
                  restockedInv = a;
                  prevenddayCount = prev.endDayCount;
                  console.log(obj.product + "==" + prev.product)
                  var inventory ={
                    branch_id : POobj.branch,
                    inventorydate: POobj.orderDate,
                    product: obj.product,
                    startInv: prevenddayCount,
                    restockQuantity: obj.quantity,
                    restockedInventory: restockedInv,
                    srp: obj.rate
                  }
                  inventoryModel.create(inventory, (err2,result2)=>{
                    if(err2){
                      console.log(err2);
                      throw err2;
                    }
                  })
                  checker = checker+1;
                }
              })
              if(checker == 0){ //if not exists in orders
                console.log(checker);
                var restockedInv = parseFloat(prev.endDayCount);
                var inventory ={
                  branch_id : POobj.branch,
                  inventorydate: POobj.orderDate,
                  product: prev.product,
                  startInv: prev.endDayCount,
                  restockQuantity: "0",
                  restockedInventory: restockedInv,
                  srp: prev.srp
                }
                inventoryModel.create(inventory, (err2,result2)=>{
                  if(err2){
                    console.log(err2);
                    throw err2;
                  }
                })
              }
              counter2 = counter2+1;
            })
          }
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
    })
  })
}

exports.pulloutUpdate = (req,res)=>{
  var dest = req.body.to;
  var origin = req.body.from;
  var reqID = req.body.requestID;
  var PulloutID = req.body.pulloutID;
  var deliveryid = req.body.deliveryID

  console.log(dest + "\n"+ origin +"\n"+ reqID +"\n"+ PulloutID +"\n"+deliveryid +"END");

  var todate = new Date();
  var dd = String(todate.getDate()).padStart(2, '0');
  var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = todate.getFullYear();
  todate = yyyy + '-' + mm + '-' + dd;
  console.log(todate);

  inventoryModel.fetchList({branch_id: dest, inventorydate:todate}, (err, updatethis)=>{
    if(err){
      throw err;
    }else{
      requestModel.getByID(reqID, (err2, withthis) =>{
        updatethis.forEach(function(doc){
          var inv = doc.toObject()
          if(inv.product == withthis.product){
            inventoryModel.updateFind({_id: inv._id}, {$inc: {additionalRestock: parseFloat(withthis.quantity), runningInventory:parseFloat(withthis.quantity) } }, (err3, result)=>{
              if(err3){
                throw err3;
              }else{
                var update = {
                  $set: {
                    status: "Delivered"
                  }
                }
                deliveryModel.update({_id: deliveryid},update, (errr, result3)=>{
                  if (errr) {
                    throw errr;
                  }else{
                    var status = {
                      $set:{
                        status:"Done"
                      }
                    }
                    pulloutModel.update({_id:PulloutID}, status, (eror, result4)=>{
                      if(eror){
                        throw eror;
                      }else{
                        requestModel.remove(reqID, (er, del)=>{
                          if(er){
                            throw er;
                          }else{
                            res.redirect('/inventory-admin');
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      })
    }
  })
}