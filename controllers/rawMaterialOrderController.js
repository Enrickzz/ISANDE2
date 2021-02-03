const rawMaterialOrderModel = require('../models/rawMaterialOrder');
const { validationResult } = require('express-validator'); 
const purchaseorderModel = require('../models/purchaseorder');
const allRawMaterialModel = require('../models/allRawMaterials');

exports.getAll = (param, callback) =>{
    rawMaterialOrderModel.getAll(param, (err, PO) => {
    if (err) throw err;
    const POobj = [];
    PO.forEach(function(doc) {
        POobj.push(doc.toObject());
    });
    callback(POobj);
  });
};


exports.fetchQuery = (req,res) => {
    var query = req;
    rawMaterialOrderModel.fetch({purchaseorderID: query}, (err, result) => {
      if(err){
        throw err;
      }
      else{
        if(result){
          const ordersfetched = [];
          result.forEach(function(doc) {
            ordersfetched.push(doc.toObject());
          });
          res(ordersfetched);
        }
        else{
          //console.log("No Orders for this supplier!");
          res(result);
        }
      }
    })
  }

  exports.addRMO = (req,res)=>{
    var cost = req.body.price;
    var qua = req.body.quantity;
    var costperQuantity = parseFloat(cost);
    var quantity = parseFloat(qua);
    var total = costperQuantity*quantity; 

    var POid=req.body.purchaseorderid;
    var RMO = {
      purchaseorderID: req.body.purchaseorderid,
      product: req.body.product,
      quantity: qua,
      supplyprice: cost,
      subtotal: total,
      uom: req.body.unit
    }
   
    rawMaterialOrderModel.saveMaterial(RMO, function (err, RMO_result) {
      purchaseorderModel.increasetotal(RMO_result.purchaseorderID, RMO_result.subtotal, function(err2, success){
        if(err){
          //console.log(err);
          res.redirect('/purchaseorder/view/' + POid);
        }
        else{
          res.redirect('/purchaseorder/view/' + RMO_result.purchaseorderID);
        }
      })
    })
};

exports.delete = (req, res) => {
  var id = req.body.RMOid;
  var POid = req.body.purchaseorderid;
  rawMaterialOrderModel.remove(id, (err, result) => {
    purchaseorderModel.decreasetotal(result.purchaseorderID, result.subtotal, function (err2, decrease) {
      if (err) {
        throw err; 
      } 
      else {
        res.redirect('/purchaseorder/view/' + POid)
      }
    })
  }); 
};

exports.update = (req,res) =>{
  var query =req.body.purchaseorderID;
  rawMaterialOrderModel.fetch({purchaseorderID: query} , (err, result) =>{
    if(err){
      throw err;
    }else{
      result.forEach(function(doc) {

        //ordersfetched.push(doc.toObject());
        var obj = doc.toObject();
        var query = obj.product;
        var x = obj.quantity;
        var increase = parseFloat(x);

        allRawMaterialModel.updateStock(query, increase ,function (err, counted){
          if(err){
            throw err;
          }
          else{

          }
        })
      });
      var update = {
        $set: {
          status:"Completed"
        }
      }
      purchaseorderModel.update(query, update, (err, result) =>{
        if(err){
          throw err;
        }else{
          res.redirect('/purchaseorder/view/'+query);
        }
      })
    }
  })
}
  



