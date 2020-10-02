const deliveryModel = require('../models/delivery');
const { validationResult } = require('express-validator');

exports.getAll = (param, callback) =>{
    deliveryModel.getAll(param, (err, branches) => {
    if (err) throw err;
    const deliveryObj = [];
    branches.forEach(function(doc) {
        deliveryObj.push(doc.toObject());
    });
    callback(deliveryObj);
  });
};

exports.getID = (req, res) => {
    var id = req.params.id;
  
    deliveryModel.getByID(id, (err, result) => {
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
    deliveryModel.fetchList(query, (err, result) => {
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