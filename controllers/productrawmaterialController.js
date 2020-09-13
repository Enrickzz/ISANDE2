const productmaterialModel = require('../models/productrawmaterial');
const { validationResult } = require('express-validator'); 

exports.getAllmaterials = (param, callback) =>{
    productmaterialModel.getAll(param, (err, materials) => {
    if (err) throw err;
    const materialsObj = [];
    materials.forEach(function(doc) {
        materialsObj.push(doc.toObject());
    });
    callback(materialsObj);
  });
};

exports.getRawMaterials = (req,res) => {
    var query = req;
  
    console.log("find raw materials by productID ID : " + query);
    productmaterialModel.fetchMaterials({ productID : query }, (err, result) => {
      if(err){
        throw err;
      }
      else{
        if(result){
          const materialsfetched = [];
          result.forEach(function(doc) {
            materialsfetched.push(doc.toObject());
          });
          res(materialsfetched);
        }
        else{
          console.log("No  for this product!");
          res.redirect('/allproduct');
        }
      }
    })
  
  };
  
  exports.getID = (req, res) => {
    var id = req.params.id;
  
    productmaterialModel.getByID(id, (err, result) => {
      if (err) {
        throw err;
      } else {
        var pgObject = result.toObject();
        res(pgObject);
      }
    });
  };