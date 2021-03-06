const salesmodel = require('../models/sales');
const inventorymodel = require('../models/inventory');
const cartmodel = require('../models/cart');

const { validationResult } = require('express-validator');


exports.getID = (req, res) => {
  var id = req.params.id;

  salesmodel.getByID(id, (err, result) => {
    if (err) {
      throw err;
    } else {
      var Object = result.toObject();
      res(Object);
    }
  });
};

exports.fetchQuery = (req,res) => {
    var query = req;
    salesmodel.fetchList({branch: query}, (err, result) => {
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
          //console.log("No orders for this branch!");
          res(result);
        }
      }
    })
  }

exports.addsale = (req,res) =>{

    var todate = new Date();
    todate.setDate(todate.getDate())
    var dd = String(todate.getDate()).padStart(2, '0');
    var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = todate.getFullYear();
    todate = yyyy + '-' + mm + '-' + dd;
    //console.log(req.body);

    var sub1 = req.body.sub;
    var tax1 = req.body.tax;
    var discount1 = req.body.discount;
    var total1 = req.body.total;
    var staffL = req.session.last_name;
    var staffF = req.session.first_name;
    var paid1 = req.body.paid;
    var change1= req.body.change;
    var saved ="";

    var addthis = {
        subtotal: sub1,
        tax : tax1,
        discount: discount1,
        total: total1,
        staffincharge: staffF +" "+ staffL,
        date:todate,
        branch: req.session.branch,
        change: change1,
        paid: paid1
    }
    const savedsaleid = [];
    salesmodel.saveSale(addthis, function(error, result){
        if(error){
            throw error;
        }else{
          //console.log("SAVED SALE\n")
          //console.log(result);
          savedsaleid.push(result._id);
          //console.log(savedsaleid[0]);
          var updateID = {
            $set:{
                status: "Completed",
                saleID: savedsaleid[0],
            }
          }
          cartmodel.update({branch: req.session.branch, status: "Pending"}, updateID, (err, result) => {
              if (err) {
                throw err; 
              } 
              else {
                //console.log(result)
                res.redirect('/salesrecords');
              }
          }); 
        }
    })
    var invID= req.body.invID;
    var cartqua = req.body.cartqua;
    var totsale = req.body.totsale;
    if(Array.isArray(invID)){
      for(var i =0 ; i < invID.length ; i++){
        var qua = Number(-cartqua[i]);
        var saletot = Number(totsale[i]);
        var dayEnd = Number(cartqua[i]);
        var update = {
            $inc: {
                restockedInventory: Number(qua),
                totsales: Number(saletot),
                endDayCount: Number(qua)
            }
        }
        inventorymodel.update({_id: invID[i]}, update, (error, result)=>{
            if(error){
                throw error;
            }else{
                
            }
        })
      }
    }else{
      var qua = Number(-cartqua);
        //console.log(qua);
        var saletot = Number(totsale);
        var dayEnd = Number(cartqua);
        var update = {
            $inc: {
                restockedInventory: Number(qua),
                totsales: Number(saletot),
                endDayCount: Number(qua)
            }
        }
        inventorymodel.update({_id: invID}, update, (error, result)=>{
            if(error){
                throw error;
            }else{
                
            }
        })
    }
    
    
    

}