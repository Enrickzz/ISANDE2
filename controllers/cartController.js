const cartmodel = require('../models/cart');


const { validationResult } = require('express-validator');

exports.fetchQuery = (req,res) => {
    var query = req;
    cartmodel.fetchList(query, (err, result) => {
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
          res(result);
        }
      }
    })
  }

exports.addcart = (req, res) =>{
    var POID = req.session.branch;
    var product = req.body.product;
    var qua = req.body.quantity;
    var rate = req.body.rate;
    var invID = req.body.invID;
    //var amount = parseFloat(qua) * parseFloat(rate);
    var branch = req.body.branch
    for(var i =0 ; i < product.length ; i++){
      var a = parseFloat(qua[i]);
      var b = parseFloat(rate[i]);
      var amount = a*b;
      var addcart = {
        product: product[i],
        quantity: qua[i],
        branch: POID,
        rate : rate[i],
        total: amount,
        inventoryID: invID[i],
      }
      if(qua[i] > 0){
        cartmodel.addTocart(addcart , function (err, result){
          if (err){
            throw err;
          }else{
            //console.log(result);
          }
        })
      }
    }
    res.redirect('/salesrecords');
  }
  
  exports.delete = (req, res) => {
    var id = req.body.cartID;
    cartmodel.remove(id, (err, result) => {
      if (err) {
        throw err; 
      } 
      else {
        res.redirect('/salesrecords');
      }
    }); 
  };
  exports.deleteall = (req, res) => {
    //var id = req.body.cartID;
    cartmodel.removeall({status: "Pending"}, (err, result) => {
      if (err) {
        throw err; 
      } 
      else {
        res.redirect('/salesrecords');
      }
    }); 
  };