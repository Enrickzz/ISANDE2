const requestListModel = require('../models/requestlist');
const suggestionsModel = require('../models/suggestions');
const { validationResult } = require('express-validator'); 

exports.getID = (req, res) => {
    var id = req;
    console.log(id);
    requestListModel.getByID(id, (err, result) => {
      if (err) {
        throw err;
      } else {
          var obj;
          if(result){
            obj = result.toObject();
          }
        res(obj);
      }
    });
  };

exports.fetchList = (req,res)=>{
  var query = req;

  requestListModel.fetch( query, (err, result) => {
    if(err){
      throw err;
    }
    else{
      if(result){
        const fetched = [];
        result.forEach(function(doc) {
            fetched.push(doc.toObject());
        });
        res(fetched);
      }
      else{
        console.log("No products for this group!");
        res.redirect('/pullout-admin');
      }
    }
  })
}

exports.create = (req,res)=>{
  var invID = req.body.invID;
  var request = {
    date: req.body.date,
    type: req.body.type, 
    product:req.body.product, 
    from: req.body.from,
    cost: req.body.cost,
    currInv: req.body.currInv,
    quantity:req.body.quantity,
    status : "Requested",
  }
  requestListModel.create(request, function (err, res2) {
      if(err){
        throw err;
      }else{
        suggestionsModel.delete({inventoryReference:invID}, (delEr, delRes)=>{
          if(delEr){
            throw delEr;
          }else{
            res.redirect('/pullout-bm');
          }
        })
        
      }
  })
};