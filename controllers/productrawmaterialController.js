const productmaterialModel = require('../models/productrawmaterial');
const { validationResult } = require('express-validator'); 
const UOMmodel = require('../models/unitofmeasure');

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

  exports.addMaterial = (req,res)=>{
    console.log("add");
    var query = req.body.UOM; //returns id
    UOMmodel.getByID(query,(err,result) =>{
      if(err){
        throw err;
      }else{

        var material = {
          productID: req.body.productID,
          rawMaterialID: req.body.rawMaterialID,
          name: req.body.name,
          quantity: req.body.quantity,
          unit: result.name,
          cost: "N/A"
        }

        //if result.inGrams is String quantity * 1
        //examples: eggs, cups of butter (different gram content with actual "cup")
        var unit1 = result.inGrams;
        var qua = req.body.quantity;
        var unitIngrams = parseFloat(unit1);
        var quantity = parseFloat(qua);
        var totalUsed = unitIngrams*quantity; //final used raw material (deduct in raw materials inventory)

        console.log(totalUsed);
        
        productmaterialModel.saveMaterial(material, function (err, result) {
          if(err){
            console.log(err);
            res.redirect('/product/view/'+material.productID);
          }
          else{
            console.log(result);
            res.redirect('/product/view/'+material.productID);
          }
        })
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

  exports.removeprodID = (req, res) => {
    var update ={
      $set: {
        productID: "N/A"
      }
    }
    var productID = req.body.productID;
    productmaterialModel.update(productID, update, (err, result) =>{
      if(err){
        console.log("NAGERROR");
        console.log(err);
        res.redirect('back');
      }
      else{
        console.log(result);
        res.redirect('/PGIncrement/'+ req.body.groupID);
      }
    })
  }

  exports.delete = (req, res) => {
    var id = req.body.rawID;
    var pageid= req.body.productID;
    productmaterialModel.remove(id, (err, result) => {
      if (err) {
        throw err; 
      } 
      else {
        console.log(result);
        res.redirect('/product/view/'+pageid);
      }
    }); 
  };

  exports.deleteMatNoLongerExists = (req,res) =>{
    var query = req;
    console.log("DELETEING tHIS : " + query);
    productmaterialModel.removeDeletedMaterial(query, (err,result) =>{
      if(err) {
        throw err;
      }
      else{
        console.log(result);
        res(result);
      }
    })
  }