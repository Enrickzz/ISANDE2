
const inventoryModel = require('../models/inventory');
const { validationResult } = require('express-validator');

exports.getAll = (param, callback) =>{
    inventoryModel.getAll(param, (err, inventoryList) => {
    if (err) throw err;
    const inventoryObj = [];
    inventoryList.forEach(function(doc) {
        inventoryObj.push(doc.toObject());
    });
    console.log(inventoryObj);
    callback(inventoryObj);
  });
};

exports.getID = (req, res) => {
    var id = req.params.id;
  
    inventoryModel.getByID(id, (err, result) => {
      if (err) {
        throw err;
      } else {
        var inventoryObj = result.toObject();
        res( inventoryObj);
      }
    });
  };

  exports.fetchQuery = (req,res) => {
    var query = req;
    inventoryModel.fetchList({branch_id: query}, (err, result) => {
      if(err){
        throw err;
      }
      else{
        if(result){
          const inventoryfetched = [];
          result.forEach(function(doc) {
            inventoryfetched.push(doc.toObject());
          });
          res(inventoryfetched);
        }
        else{
          console.log("No inventory for this branch!");
          res(result);
        }
      }
    })
  }
