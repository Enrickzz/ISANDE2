const productionorderModel = require('../models/productionorder');
const branchorderModel = require('../models/branchorder'); 
const { validationResult } = require('express-validator'); 

exports.getAll = (param, callback) =>{
    productionorderModel.getAll(param, (err, PO) => {
    if (err) throw err;
    const POobj = [];
    PO.forEach(function(doc) {
        POobj.push(doc.toObject());
    });
    console.log(POobj);
    callback(POobj);
  });
};

exports.getID = (req, res) => {
  var id = req.params.id;

  productionorderModel.getByID(id, (err, result) => {
    if (err) {
      throw err;
    } else {
      var POobj = result.toObject();
      res(POobj);
    }
  });
};

exports.addproductionorder = (req,res)=>{
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;

  var date = today.toString();

  var productionorder = {
    orderDate: date,
    branch: req.body.branch,
    status: "Pending"
  }
  productionorderModel.create(productionorder, function (err, result_PO) {
    if(err){
      console.log(err);
      res.redirect('/productionorder');
    }
    else{
      branchorderModel.fetchList({productionorderID:"buffer"}, (err, results) =>{
        if(err){
          throw err;
        }else{
          results.forEach(function(doc){
            var obj = doc.toObject();
            branchorderModel.update(obj._id, {productionorderID: result_PO._id}, (error, success)=>{
              if(error){
                throw error;
              }
            })
          })
        }
      })
      res.redirect('/productionorder/view/' + result_PO._id)
    }
  })
};

exports.statuschangeAcc = (req,res) =>{
  var change = {
    $set: {
      status: "In Production"
    }
  }
  var id = req.body.productionorderID;
  productionorderModel.update(id, change, (err, result)=>{
    if(err){
      throw err;
    }else{
      res.redirect('/productionorder/view/'+id);
    }
  })
}
exports.statuschangeRej = (req,res) =>{
  var change = {
    $set: {
      status: "Rejected"
    }
  }
  var id = req.body.productionorderID;
  productionorderModel.update(id, change, (err, result)=>{
    if(err){
      throw err;
    }else{
      res.redirect('/productionorder/view/'+id);
    }
  })
}
