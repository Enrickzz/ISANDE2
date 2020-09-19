const rawMaterialOrderModel = require('../models/rawMaterialOrder');
const { validationResult } = require('express-validator'); 

exports.getAll = (param, callback) =>{
    rawMaterialOrderModel.getAll(param, (err, PO) => {
    if (err) throw err;
    const POobj = [];
    PO.forEach(function(doc) {
        POobj.push(doc.toObject());
    });
    console.log(POobj);
    callback(POobj);
  });
};


exports.fetchQuery = (req,res) => {
    var query = req;
  
    console.log("FETCHING ORDER LIST WITH QUERY PO ID = " + query);
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
          console.log("No Orders for this supplier!");
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
      if(err){
        console.log(err);
        res.redirect('/purchaseorder/view/' + POid);
      }
      else{
        res.redirect('/purchaseorder/view/' + RMO_result.purchaseorderID);
      }
    })
};

exports.delete = (req, res) => {
  var id = req.body.RMOid;
  var POid = req.body.purchaseorderid;
  rawMaterialOrderModel.remove(id, (err, result) => {
    if (err) {
      throw err; 
    } 
    else {
      res.redirect('/purchaseorder/view/' + POid)
    }
  }); 
};
  



