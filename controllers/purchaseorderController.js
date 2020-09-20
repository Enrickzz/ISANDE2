const purchaseorderModel = require('../models/purchaseorder');
const { validationResult } = require('express-validator'); 

exports.getAll = (param, callback) =>{
    purchaseorderModel.getAll(param, (err, PO) => {
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

  purchaseorderModel.getByID(id, (err, result) => {
    if (err) {
      throw err;
    } else {
      var POobj = result.toObject();
      res(POobj);
    }
  });
};

exports.addPurchaseOrder = (req,res)=>{
  var purchaseorder = {
    supplierID: req.body.supplierid,
    dueDate: req.body.duedate,
    orderDate: req.body.orderdate,
    status: req.body.status,
    total: "0",
    shippingaddress: req.body.billaddress
  }
  purchaseorderModel.createPurchaseOrder(purchaseorder, function (err, result_PO) {
    if(err){
      console.log(err);
      res.redirect('/purchaseorder');
    }
    else{
      console.log(result_PO);
      res.redirect('/purchaseorder/view/' + result_PO._id)
    }
  })
};

exports.statuschange = (req,res) =>{
  var change = {
    $set: {
      status: req.body.changestatus
    }
  }
  var id = req.body.purchaseorderID;
  purchaseorderModel.update(id, change, (err, result)=>{
    if(err){
      throw err;
    }else{
      res.redirect('/purchaseorder/view/'+id);
    }
  })
}
