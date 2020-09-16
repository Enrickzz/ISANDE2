const productgroupsModel = require('../models/productgroups');
const { validationResult } = require('express-validator');

exports.getAllpg = (param, callback) =>{
  productgroupsModel.getAll(param, (err, PGroups) => {
    if (err) throw err;
    const pgObjects = [];
    PGroups.forEach(function(doc) {
      pgObjects.push(doc.toObject());
    });
    callback(pgObjects);
  });
};

  exports.getID = (req, res) => {
    var id = req.params.id;
  
    productgroupsModel.getByID(id, (err, result) => {
      if (err) {
        throw err;
      } else {
        var pgObject = result.toObject();
        res(pgObject);
      }
    });
  };

exports.addGroup = (req,res)=>{
    var pgroup = {
      name: req.body.name,
      description: req.body.description,
      UOM: req.body.UOM,
      num_products: "0",
    }
    productgroupsModel.createProductGroup(pgroup, function (err, pgroup_result) {
      if(err){
        console.log(err);
        res.redirect('/productgroup');
      }
      else{
        console.log(pgroup_result);
        res.redirect('/productgroup')
      }
    })
};

exports.incrementNumProd = (req,res)=>{
  var query= req;
  productgroupsModel.increaseOne( query ,function (err, counted) {
    if(err) {
      throw err;
    }
    else{
      console.log("INCREASE successful!");
      res(err);
    }
  })
};

exports.decrementNumProd = (req,res)=>{
  var query= req;
  productgroupsModel.decreaseOne( query ,function (err, counted) {
    if(err) {
      throw err;
    }
    else{
      console.log("DECREASE successful!");
      res(counted);
    }
  })
};