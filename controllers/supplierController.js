const supplierModel = require('../models/supplier');
const { validationResult } = require('express-validator'); 

exports.getAll = (param, callback) =>{
    supplierModel.getAll(param, (err, suppliers) => {
    if (err) throw err;
    const suppliersObj = [];
    suppliers.forEach(function(doc) {
        suppliersObj.push(doc.toObject());
    });
    console.log(suppliersObj);
    callback(suppliersObj);
  });
};

exports.getID = (req, res) => {
  var id = req.params.id;

  supplierModel.getByID(id, (err, result) => {
    if (err) {
      throw err;
    } else {
      var supplierObj = result.toObject();
      res(supplierObj);
    }
  });
};

exports.register = (req, res) => {
  // 1. Validate request

  // 2. If VALID, find if email exists in users
  //      NEW USER (no results retrieved)
  //        a. Hash password
  //        b. Create user
  //        c. Redirect to login page
  //      EXISTING USER (match retrieved)
  //        a. Redirect user to login page with error message.

  // 3. If INVALID, redirect to register page with errors
  const errors = validationResult(req);

  const { company, first_name, last_name, email, mobileno} = req.body;
    
    if (errors.isEmpty()) {      
    supplierModel.getOne({ company: company }, (err, result) => {
      if (result) {
        console.log("Company already taken!");
        // found a match, return to login with error
      req.flash('error_msg', 'Company already taken.');
      //   req.session.save( function(){ res.redirect('/'); })
      res.redirect('/supplier');

      } else {

          const newSupplier = {
            company,
            first_name,
            last_name,
            mobileno,
            email
          };
        
          supplierModel.register(newSupplier, (err, supplier) => {
            if (err) {
              req.flash('error_msg', 'Could not create supplier. Please try again.');
              console.log(err.errors);
              result = { success: false, message: "Supplier was not created!" }
              //res.send(result); this causes an error LOL :<
              res.redirect('/supplier');
   
            } else {
              console.log("Successfully added supplier!");
              console.log(supplier);
              result = { success: true, message: "Supplier created!" }
              //res.send(result); this causes an error LOL :<

              req.flash('success_msg', 'Supplier added.');
              res.redirect('/supplier');
            }
          });
      }
    });
  } 
  else {
    const messages = errors.array().map((item) => item.msg);

    req.flash('error_msg', messages.join(' '));
    res.redirect('/supplier'); // making this redirect to / makes req.flash not appear
  }
};

exports.update  = (req, res) => {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var company = req.body.company;
    var email = req.body.email;
    var mobileno = req.body.mobileno;
    var id = req.body.supplierID;
    
    query = {
        'first_name': first_name,
        'last_name': last_name,
        'company': company,
        'email': email,
        'mobileno': mobileno
    }

    supplierModel.update(id, query, function(err, update) {
      if(err) {
          console.log(err);
          req.flash('error_msg', 'Cannot update supplier details.');
              res.redirect('/supplier');
      }
     
      else {
          console.log('Successfully updated supplier details!');
          console.log(update);
          req.flash('success_msg', 'Updated supplier details.');
  
              res.redirect('/supplier');
      }
  });
};
