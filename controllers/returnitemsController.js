
const returnItemsModel = require('../models/returnitems');
const returnModel = require('../models/returns');
const { validationResult } = require('express-validator');


  exports.fetchQuery = (req,res) => {
    var query = req;
    returnItemsModel.fetchList(query, (err, result) => {
      if(err){
        throw err;
      }
      else{
        if(result){
          const returnObj = [];
          result.forEach(function(doc) {
            returnObj.push(doc.toObject());
          });
          res(returnObj);
        }
        else{
          //console.log("No returns for this branch!");
          res(result);
        }
      }
    })
  }
  exports.addreturnitem = (req,res)=>{
    var qua = req.body.quantity;
    var rate = req.body.sellingprice;
    var fqua = parseFloat(qua);
    var frate = parseFloat(rate);
    var tot = fqua*frate;
    
    var returns = {
      returnID: req.body.returnID,
      branchID: req.body.branchID,
      product: req.body.product, //data processing by order table
      unit:req.body.unit, //idk if maglalagay tayo ng default reorder pt.
      quantity: req.body.quantity,
      sellingprice: req.body.sellingprice,
      amount: tot,
    }
    returnItemsModel.create(returns, function (err, res2) {
        var a = res2.amount;
        var add = parseFloat(a);
        returnModel.increaseTotal(res2.returnID, add, function (err2, success){
            if(err2){
                //console.log(err2);
                res.redirect('/adjustments/view/'+ req.body.returnID);
              }
              else{
                  res.redirect('/adjustments/view/'+ req.body.returnID)
              }
        } )
    })
};

exports.delete = (req, res) => {
    var id = req.body.returnitemID;
    var returnID = req.body.returnID;
    var amount = req.body.amount;
    returnItemsModel.remove(id, (err, result) => {
      returnModel.decreasetotal(returnID, amount, function (err2, decrease) {
        if (err) {
          throw err; 
        } 
        else {
          res.redirect('/adjustments/view/' + returnID);
        }
      })
    }); 
  };