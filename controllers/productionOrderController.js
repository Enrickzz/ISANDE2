const productionorderModel = require('../models/productionorder');
const branchorderModel = require('../models/branchorder'); 
const inventoryModel = require('../models/inventory'); 
const deliveryModel = require('../models/delivery'); 

const { validationResult } = require('express-validator'); 
const { addPurchaseOrder } = require('./purchaseorderController');

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
exports.paramgetID = (req, res) => {
  var id = req;

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
    status: "Pending",
    total: "0"
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
              }else{
                productionorderModel.increasetotal(result_PO._id, obj.amount,(error2,success2) =>{
                  if(error2){
                    throw error2;
                  }
                })
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
  var branch = req.body.branch;
  var date = req.body.date;
  var total = req.body.total;
  productionorderModel.update(id, change, (err, result)=>{
    if(err){
      throw err;
    }else{
      var delivery = {
        deliverydate: date,
        productionID: id,
        total: total,
        status: "In production"
      }
      deliveryModel.create(delivery, (err2,result)=>{
        if (err2) {
          throw err2;
        }else{
          res.redirect('/productionorder/view/'+id);
        }
      })
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
exports.statuschange4deliver = (req,res) =>{
  var change = {
    $set: {
      status: "For Delivery"
    }
  }
  var id = req.body.productionorderID;
  productionorderModel.update(id, change, (err, result)=>{
    if(err){
      throw err;
    }else{
      var update ={
        $set:{
          status: "In Transit"
        }
      }
      deliveryModel.update({productionID: id}, update, (error, success)=>{
        if (error) {
          throw error;
        }else{
          res.redirect('/productionorder/view/'+id);
        }
      })
    }
  })
}
