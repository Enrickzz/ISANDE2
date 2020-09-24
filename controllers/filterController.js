const filterModel = require('../models/filters');
const { validationResult } = require('express-validator');


exports.getfilter= (req, res) =>{
    var query = req;
    const obj = {}
    filterModel.fetch(query, (err, result) =>{
        if(err){
            throw err;
        }else{
            var filter = result.toObject();
            res(filter);
        }
    })
}

exports.nextday = (req, res) =>{
    var query = req;
    var curr = req.body.currdate;
    var todate = new Date(curr);
    todate.setDate(todate.getDate()+1)

    var dd = String(todate.getDate()).padStart(2, '0');
    var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = todate.getFullYear();

    todate = yyyy + '-' + mm + '-' + dd;
    var nextday = todate.toString();

    var update = {
        $set: {
            date: nextday 
        }
    }
    filterModel.update({for: "inventory"}, update , (err, result) =>{
        if(err){
            res.redirect('inventory-admin')
            throw err;
        }else{
            res.redirect('inventory-admin')
        }
    })
}
exports.prevday = (req, res) =>{
    var query = req;
    var curr = req.body.currdate;
    var todate = new Date(curr);
    todate.setDate(todate.getDate()-1)

    var dd = String(todate.getDate()).padStart(2, '0');
    var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = todate.getFullYear();

    todate = yyyy + '-' + mm + '-' + dd;
    var nextday = todate.toString();

    var update = {
        $set: {
            date: nextday 
        }
    }
    filterModel.update({for: "inventory"}, update , (err, result) =>{
        if(err){
            res.redirect('inventory-admin')
            throw err;
        }else{
            res.redirect('inventory-admin')
        }
    })
}
exports.changebranch = (req, res) =>{
    var branch = req.body.branch;
    var update = {
        $set: {
            branch: branch
        }
    }
    filterModel.update({for: "inventory"}, update , (err, result) =>{
        if(err){
            res.redirect('inventory-admin')
            throw err;
        }else{
            res.redirect('inventory-admin')
        }
    })
}