const allRawMaterialModel = require('../models/allRawMaterials');
const { validationResult } = require('express-validator'); 

exports.getAllmaterials = (param, callback) =>{
    allRawMaterialModel.getAll(param, (err, materials) => {
    if (err) throw err;
    const materialsObj = [];
    materials.forEach(function(doc) {
        materialsObj.push(doc.toObject());
    });
    callback(materialsObj);
  });
};

exports.addMaterial = (req,res)=>{
  var product = {
    name: req.body.name,
    stock: "0",
    UOM: req.body.UOM,
    costperUnit: req.body.costperUnit
  }
  
  allRawMaterialModel.saveMaterial(product, function (err, result) {
    if(err){
      console.log(err);
      res.redirect('/rawmaterials');
    }
    else{
      console.log(result);
      res.redirect('/rawmaterials')
    }
  })
};