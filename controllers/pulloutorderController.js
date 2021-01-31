
const pulloutorderModel = require('../models/pulloutorders');
const { validationResult } = require('express-validator');
const requestModel = require('../models/requestlist');
const deliveryModel = require('../models/delivery');

exports.getAll = (param, callback) =>{
    pulloutorderModel.getAll(param, (err, pulloutorderList) => {
    if (err) throw err;
    const pulloutsObk = [];
    pulloutorderList.forEach(function(doc) {
        pulloutsObk.push(doc.toObject());
    });
    callback(pulloutsObk);
  });
};

exports.getID = (req, res) => {
  var id = req.params.id;

  pulloutorderModel.getByID(id, (err, result) => {
    if (err) {
      throw err;
    } else {
      var pulloutObj = result.toObject();
      res( pulloutObj);
    }
  });
};

exports.fetchOne = (req, res) =>{
  var query = req;
  pulloutorderModel.fetch(query, (err,result)=>{
    if(err){
      throw err;
    }
    else{
      if(result){
        const fetched = result.toObject();
        res(fetched);
      }
      else{
        //console.log("No products for this group!");
        res(result);
      }
    }
  })
}
exports.fetchQuery = (req,res) => {
  var query = req;
  pulloutorderModel.fetchList(query, (err, result) => {
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
        //console.log("No inventory for this branch!");
        res(result);
      }
    }
  })
}

exports.create= (req,res)=>{
  var todate = new Date();
  var dd = String(todate.getDate()).padStart(2, '0');
  var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = todate.getFullYear();
  todate = yyyy + '-' + mm + '-' + dd;
  var datequery = todate;
  var reqpulloutid = req.body.from
  var picked =req.body.tobranch;
  var reqaddstockPick = req.body.to;

  if(req.body.to == "dropdown"){//if radio selection is dropdown list
    requestModel.getByID(reqpulloutid, (err, reqobj)=>{
      var total = parseFloat(reqobj.quantity) *parseFloat(reqobj.cost);
      var POorder = {
        FrombranchID: reqobj.from,
        TobranchID: picked,
        pulloutdate: datequery,
        amount: total,
        status:"Approved",
        item: reqpulloutid
      }
      pulloutorderModel.create(POorder, (error, POOobj)=>{
        if(error){
          res.redirect('/pullout-admin');
        }else{
          var delivery = {
            deliverydate: datequery,
            productionID: reqpulloutid,
            total: total,
            status: "In Transit",
            type: "Pullout Order",
            branchTO: picked
          }
          deliveryModel.create(delivery, (err2,result)=>{
            if (err2) {
              throw err2;
            }else{
              res.redirect('/delivery/view/'+result._id);
            }
          })
        }
      })
    })
  }else{ //if radio selection is request list
    requestModel.getByID(reqaddstockPick, (e, tobranch)=>{
      requestModel.getByID(reqpulloutid, (e1, frombranch)=>{
        var total = parseFloat(frombranch.quantity) *parseFloat(frombranch.cost);
        var POorder = {
          FrombranchID: frombranch.from,
          TobranchID: tobranch.from,
          pulloutdate: datequery,
          amount: total,
          status:"Approved",
          item: reqpulloutid,
          destitem: reqaddstockPick
        }
        pulloutorderModel.create(POorder, (error, POOobj)=>{
          if(error){
            res.redirect('/pullout-admin');
          }else{
            var delivery = {
              deliverydate: datequery,
              productionID: reqpulloutid,
              total: total,
              status: "In Transit",
              type: "Pullout Order",
              branchTO: picked
            }
            deliveryModel.create(delivery, (err2,result)=>{
              if (err2) {
                throw err2;
              }else{
                res.redirect('/delivery/view/'+result._id);
              }
            })
          }
        })
        
      })
      
    })
  }
}