
const returnModel = require('../models/returns');
const { validationResult } = require('express-validator');
const returnItemsModel = require('../models/returnitems');
const inventoryModel = require('../models/inventory');

exports.getAll = (param, callback) =>{
    returnModel.getAll(param, (err, returnList) => {
    if (err) throw err;
    const returnsObk = [];
    returnList.forEach(function(doc) {
        returnsObk.push(doc.toObject());
    });
    callback(returnsObk);
  });
};

exports.getID = (req, res) => {
    var id = req.params.id;
  
    returnModel.getByID(id, (err, result) => {
      if (err) {
        throw err;
      } else {
        var returnObj = result.toObject();
        res( returnObj);
      }
    });
  };

  exports.fetchQuery = (req,res) => {
    var query = req;
    returnModel.fetchList(query, (err, result) => {
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

  exports.addreturn = (req,res)=>{
    var date = req.body.returndate;
    var todate = new Date();
  
    var type = req.body.type;
    var branch = req.session.branch;
    var returns = {
      branchID: branch,
      returndate: date, 
      type:type, 
      amount: "0",
      status: "Unsent",
    }
    returnModel.create(returns, function (err, res2) {
        if(err){
          throw err;
        }else{
          res.redirect('/adjustments/view/'+ res2._id)
        }
    })
};


  exports.update = (req,resss) =>{
    var id = req.body.returnID;
    var change = req.body.changestatus;
    var branch = req.body.branch;
    var curr = req.body.currstat;
    var todate = new Date();
    todate.setDate(todate.getDate())
    var dd = String(todate.getDate()).padStart(2, '0');
    var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = todate.getFullYear();
    todate = yyyy + '-' + mm + '-' + dd;

    if(curr == "Sales Return"){
      returnItemsModel.fetchList({branchID: branch, returnID:id}, (err,result)=>{
        result.forEach(function(doc) {
          var obj = doc.toObject();
          var update = {
            $inc: {
              returns: obj.amount,
              totsales: -obj.amount
            }
          }
          inventoryModel.updateFind({branch_id: req.session.branch, product: obj.product, inventorydate: todate }, update, function(error, success){
            if(error){
              console.log(error);
              throw error;
            }else{

            }
          })
        })
        var changestatus = {
          $set:{
            status : "Done"
          }
        }
        returnModel.update({_id:id}, changestatus, function (er, done){
          if(er){
            throw er;
          }else{
            resss.redirect('/adjustments/view/'+id)
          }
        })
      })
    }else if(curr == "Damaged Goods"){
      returnItemsModel.fetchList({branchID: branch, returnID:id}, (err,result)=>{
        /*result.forEach(function(doc) {
          var obj = doc.toObject();
          var update = {
            $inc: {
              returns: obj.quantity,
              totsales: -obj.amount
            }
          }
          inventoryModel.updateFind({branch_id: obj.branchID, product: obj.product, inventorydate: todate }, update, function(error, success){
            if(error){
              console.log(error);
              throw error;
            }else{

            }
          })
        })*/
        var changestatus = {
          $set:{
            status : "For Review"
          }
        }
        returnModel.update({_id:id}, changestatus, function (er, done){
          if(er){
            throw er;
          }else{
            resss.redirect('/adjustments/view/'+id)
          }
        })
      })

    }
  }
