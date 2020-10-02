const supplierListModel = require('../models/supplierList');
const { validationResult } = require('express-validator'); 

exports.getAll = (param, callback) =>{
    supplierListModel.getAll(param, (err, PO) => {
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
   supplierListModel.fetchList({supplierID: query}, (err, result) => {
      if(err){
        throw err;
      }
      else{
        if(result){
          const suppliesfetched = [];
          result.forEach(function(doc) {
            suppliesfetched.push(doc.toObject());
          });
          res(suppliesfetched);
        }
        else{
          res(result);
        }
      }
    })
  }
  



