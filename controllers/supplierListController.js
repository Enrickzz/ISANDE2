const supplierListModel = require('../models/supplierList');
const { validationResult } = require('express-validator'); 

exports.getAll = (param, callback) =>{
    supplierListModel.getAll(param, (err, PO) => {
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
  
    console.log("FETCHING SUPPLIER LIST WITH QUERY SUPPLIERID = " + query);
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
          console.log("No supplylist for this supplier!");
          res(result);
        }
      }
    })
  }
  



