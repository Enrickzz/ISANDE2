
const inventoryModel = require('../models/inventory');
const branchOrderModel = require('../models/branchorder');
const productionOrderModel = require('../models/productionorder');
const deliveryModel = require('../models/delivery');
const requestModel = require('../models/requestlist');
const pulloutModel = require('../models/pulloutorders');
const suggestionsModel = require('../models/suggestions');

const { validationResult } = require('express-validator');

exports.getAll = (param, callback) =>{
    inventoryModel.getAll(param, (err, inventoryList) => {
    if (err) throw err;
    const inventoryObj = [];
    inventoryList.forEach(function(doc) {
        inventoryObj.push(doc.toObject());
    });
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
          res(result);
        }
      }
    })
  }
  exports.fetchProducts = (req,res) => {
    var query = req;
    inventoryModel.fetchList(query, (err, result) => {
      if(err){
        throw err;
      }
      else{
        if(result){
          const inventoryfetched = [];
          result.forEach(function(doc) {
            var p = doc.toObject();
            inventoryfetched.push(p.product);
          });
          res(inventoryfetched);
        }
        else{
          res(result);
        }
      }
    })
  }
  exports.find1 = (req,res) => {
    var query = req;
    inventoryModel.findone(query, (err, result) => {
      if(err){
        throw err;
      }
      else{
        if(result){
          var inventoryObj = result.toObject();
          res(inventoryObj);
        }
        else{
          res(result);
        }
      }
    })
  }
  var getDates = function(startDate, endDate) {
    var dates = [],
        currentDate = startDate,
        addDays = function(days) {
          var date = new Date(this.valueOf());
          date.setDate(date.getDate() + days);
          return date;
        };
    while (currentDate <= endDate) {
      var todate = new Date();
      todate.setDate(currentDate.getDate())
      var dd = String(todate.getDate()).padStart(2, '0');
      var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = todate.getFullYear();
      todate = yyyy + '-' + mm + '-' + dd;
      dates.push(todate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  };

exports.midendCountUpdate = (req,res) =>{
  var todate = new Date();
  //var y = todate.getFullYear(), m =String(todate.getMonth() + 1).padStart(2, '0'), d=String(todate.getDate()).padStart(2, '0');
  todate.setDate(todate.getDate()-1)
  var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
  var dd = String(todate.getDate()).padStart(2, '0');
  var yyyy = todate.getFullYear();

  var start = new Date()
  start.setDate(start.getDate()-7);
  var sM = String(start.getMonth() + 1).padStart(2, '0'); //January is 0!
  var sD = String(start.getDate()).padStart(2, '0');
  var sY = start.getFullYear();
  
  
  var daterange = getDates(new Date(sY,sM,sD), new Date(yyyy,mm,dd));

  var mid = req.body.midDayCount;
  var end = req.body.endDayCount;
  var id = req.body.id;
  var restocked = req.body.restocked;
  var srp = req.body.srp;
  var runninginv = req.body.changedStock;
  var middaysales = req.body.middaysale;
  var invDate = req.body.thisdate;
  var thisbranch = req.body.branch;
  var product = req.body.product;
  
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
    var totmiddaytoendday = parseFloat(0);
    var averagemidtoend;
    inventoryModel.update({_id : id}, update, (err,res2) =>{
      if(err){
        throw err;
      }else{
        inventoryModel.fetchList({branch_id: thisbranch,product: product, inventorydate: daterange}, (invErr, inv)=>{
          if(invErr){
            throw invErr;
          }else{
            for(var i = 0; i< inv.length; i++){
              totmiddaytoendday = totmiddaytoendday + parseFloat(inv[i].runningInventory) - parseFloat(inv[i].endDayCount); 
            }
            averagemidtoend = totmiddaytoendday/inv.length;
            var todate = new Date();
            var y = todate.getFullYear(), m =String(todate.getMonth() + 1).padStart(2, '0'), d=String(todate.getDate()).padStart(2, '0');
            if(mid > averagemidtoend*.80){
              if(Math.floor((mid-averagemidtoend)*.80) > 2){
                var makesuggestion={
                  date: y+"-"+m+"-"+d,
                  for: "Branch Manager",
                  tobranch: req.session.branch,
                  suggestion: res2.branch_id+" has sold on average " + Math.floor(averagemidtoend)  + " Piece/s of " +product+" from middle to end of the day. \nPULLOUT "+ Math.floor((mid-averagemidtoend)*.80)+" Piece/s of "+product+".",
                  status: "Unresolved",
                  type: "Pullout",
                  inventoryReference: id,
                }
                suggestionsModel.create(makesuggestion, (sErr, sResult)=>{
                  if(sErr){
                    throw sErr;
                  }else{
                  }
                })
              }
             }else if(mid < averagemidtoend*.80){
               //request list suggestion
               if(Math.floor((mid-averagemidtoend)*.80)*-1 > 2){ //doesnt make request less than 1
                var makesuggestion={
                  date: y+"-"+m+"-"+d,
                  for: "Branch Manager",
                  tobranch: req.session.branch,
                  suggestion: res2.branch_id+" has sold on average " + Math.floor(averagemidtoend)  + " Piece/s of " +product+" from middle to end of the day. \nREQUEST "+ Math.floor((mid-averagemidtoend)*.80)*-1+" Piece/s of "+product+".",
                  status: "Unresolved",
                  type: "Request",
                  inventoryReference: id,
                }
                suggestionsModel.create(makesuggestion, (sErr, sResult)=>{
                  if(sErr){
                    throw sErr;
                  }else{
                  }
                })
               }
             }
            totmiddaytoendday = parseFloat(0);
          }
        })
        res.redirect('/inventory-admin');
      }
    })
  }else if(end > 0){
    var endtoNum = parseFloat(req.body.endDayCount);
    var chngedstock = parseFloat(req.body.changedStock);
    var srpfloat = parseFloat(req.body.srp);
    var midsales = parseFloat(req.body.middaysale);
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
        suggestionsModel.delete1({inventoryReference: id}, (er,del)=>{
          if (er){
            throw er;
          }else{
            res.redirect('/inventory-admin');
          }
        })
      }
    }) 
  }
}
exports.QMaddInventory = (req, res) => {
  var prodID = req.body.productionorderID;
  var qmproduct =req.body.QMproduct;
  var qmrate =req.body.QMrate;
  var qmamount = req.body.QMamount;
  var actualQty = req.body.actualQty;

  productionOrderModel.getByID(prodID, (er,POobj)=>{
    branchOrderModel.fetchList({productionorderID: prodID}, (err, result)=>{
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
        inventoryModel.fetchList({inventorydate: ""+todate, branch_id: POobj.branch}, (error, prevdayInv)=>{
          if(error){
            res.redirect('back')
          }else{
            var counter2 = 0;
            prevdayInv.forEach(function(doc){
              var prev = doc.toObject();
              //var obj;
              var checker = 0;
              checker = 0;
              for(var i = 0 ; i < qmproduct.length ; i++){
                var prevenddayCount ="0";
                var restockedInv= 0;
                if(qmproduct[i] == prev.product){
                  var a = parseFloat(actualQty[i]) + parseFloat(prev.restockedInventory);
                  restockedInv = a;
                  prevenddayCount = prev.restockedInventory;
                  var inventory ={
                    branch_id : POobj.branch,
                    inventorydate: POobj.orderDate,
                    product: qmproduct[i],
                    startInv: Number(prevenddayCount),
                    restockQuantity: actualQty[i],
                    restockedInventory: restockedInv,
                    srp: qmrate[i]
                  }
                  var thisqty = actualQty[i];
                  var thisprd = qmproduct[i];
                  inventoryModel.create(inventory, (err2,result2)=>{
                    if(err2){
                      //console.(err2);
                      throw err2;
                    }else{
                      var updateBO = {
                        $set:{
                          actualDelivered:thisqty
                        }
                      }
                      //console.log(updateBO);
                      branchOrderModel.updateOne({productionorderID: prodID, product: thisprd}, updateBO, (thiser, thisres)=>{
                        if(thiser){
                          //console.log("NAGERROR\n\n+"+ thiser);
                          throw thiser;
                        }else{
                          //console.log(thisprd);
                          //console.log("Successful");
                        }
                      })
                    }
                  })
                  checker = checker+1;
                }
              }
              if(checker==0){ //if not exist in prev inventory
                var restockedInv = parseFloat(prev.restockedInventory);
                var inventory ={
                  branch_id : POobj.branch,
                  inventorydate: POobj.orderDate,
                  product: prev.product,
                  startInv: Number(restockedInv),
                  restockQuantity: "0",
                  restockedInventory: restockedInv,
                  srp: prev.srp
                }
               inventoryModel.create(inventory, (err2,result2)=>{
                  if(err2){
                    //console.log(err2);
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
              status: "Delivered with Quantity Change"
            }
          }
          deliveryModel.update({_id: delID},update, (errr, result3)=>{
            if (errr) {
              throw errr;
            }else{
              var status = {
                $set:{
                  status:"Completed with Quantity Change"
                }
              }
              productionOrderModel.update(prodID,status, (e4,result4)=>{
                if (e4) {
                  throw e4;
                }else{
                  suggestionsModel.delete({tobranch:req.session.branch, date:result4.orderDate, for:"Branch Manager"}, (error3,success3)=>{
                    if(error3){
                      throw error3;
                    }else{
                      res.redirect('/inventory-admin');
                    }
                  })
                }
              })
            }
          })
        })
      }
    })
  })
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
        inventoryModel.fetchList({inventorydate: "" + todate , branch_id: POobj.branch}, (error, prevdayInv)=>{
          if (error) {
            //console.log(error);
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
                if(obj.product == prev.product){
                  var a = parseFloat(obj.quantity) + parseFloat(prev.restockedInventory);
                  restockedInv = a;
                  prevenddayCount = prev.restockedInventory;
                  var inventory ={
                    branch_id : POobj.branch,
                    inventorydate: POobj.orderDate,
                    product: obj.product,
                    startInv: Number(prevenddayCount),
                    restockQuantity: obj.quantity,
                    restockedInventory: restockedInv,
                    srp: obj.rate
                  }
                  inventoryModel.create(inventory, (err2,result2)=>{
                    if(err2){
                      //console.log(err2);
                      throw err2;
                    }
                  })
                  checker = checker+1;
                }
              })
              if(checker == 0){ //if not exists in orders
                var restockedInv = parseFloat(prev.restockedInventory);
                var inventory ={
                  branch_id : POobj.branch,
                  inventorydate: POobj.orderDate,
                  product: prev.product,
                  startInv: Number(restockedInv),
                  restockQuantity: "0",
                  restockedInventory: restockedInv,
                  srp: prev.srp
                }
                inventoryModel.create(inventory, (err2,result2)=>{
                  if(err2){
                    //console.log(err2);
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
                  suggestionsModel.delete({tobranch:req.session.branch, date:result4.orderDate, for:"Branch Manager"}, (error3,success3)=>{
                    if(error3){
                      throw error3;
                    }else{
                      res.redirect('/inventory-admin');
                    }
                  })
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
  var todate = new Date();
  var dd = String(todate.getDate()).padStart(2, '0');
  var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = todate.getFullYear();
  todate = yyyy + '-' + mm + '-' + dd;
  inventoryModel.fetchList({branch_id: dest, inventorydate:todate}, (err, updatethis)=>{
    if(err){
      throw err;
    }else{
      requestModel.getByID(reqID, (err2, withthis) =>{
        updatethis.forEach(function(doc){
          var inv = doc.toObject()
          if(inv.product == withthis.product){
            inventoryModel.updateFind({_id: inv._id}, {$inc: {additionalRestock: parseFloat(withthis.quantity), restockedInventory:parseFloat(withthis.quantity) } }, (err3, result)=>{
              if(err3){
                throw err3;
              }else{
                inventoryModel.updateFind({branch_id: withthis.from, inventorydate: todate, product: withthis.product }, 
                  {$inc:{ pulloutStock: (parseFloat(withthis.quantity)), restockedInventory: -(parseFloat(withthis.quantity)) }}, (err4, invresult) =>{
                    if(err4){
                      throw err4
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
                              requestModel.update({_id: result4.item}, {$set: {status: "Pulled"} } ,(t,r1)=>{
                                if(t){
                                  throw t;
                                }else{
                                  if(result4.destitem != "override"){
                                    requestModel.update({_id: result4.destitem}, {$set: {status: "Fulfilled"} }, (t2,r2)=>{
                                      if(t2){
                                        throw t2;
                                      }else{
                                        res.redirect('inventory-admin');
                                      }
                                    })
                                  }else{
                                    res.redirect('inventory-admin');
                                  }
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
            }
          })
        })
      }
    })
  }