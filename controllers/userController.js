const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const { validationResult } = require('express-validator');

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

    const { usertype, first_name, last_name, mobileno, email, password, branch, image} = req.body;
      
      if (errors.isEmpty()) {      
      userModel.getOne({ email: email }, (err, result) => {
        if (result) {
          // found a match, return to login with error
        req.flash('error_msg', 'Email already taken.');
        //   req.session.save( function(){ res.redirect('/'); })
        res.redirect('/manageusers');

        } else {
          const saltRounds = 10;
  
          // Hash password
          bcrypt.hash(password, saltRounds, (err, hashed) => {
            const newUser = {
              usertype,
              first_name,
              last_name,
              mobileno,
              email,
              branch,
              password: hashed,
              image
            };
          
            userModel.register(newUser, (err, user) => {
              if (err) {
                req.flash('error_msg', 'Could not create user. Please try again.');
                console.log(err.errors);
                result = { success: false, message: "User was not created!" }
                //res.send(result); this causes an error LOL :<
                res.redirect('/manageusers');
     
              } else {
                result = { success: true, message: "User created!" }
                //res.send(result); this causes an error LOL :<

                req.flash('success_msg', 'User registered.');
                res.redirect('/manageusers');
              }
            });
          });
        }
      });
    } 
    else {
      const messages = errors.array().map((item) => item.msg);
  
      req.flash('error_msg', messages.join(' '));
      res.redirect('/manageusers'); // making this redirect to / makes req.flash not appear
    }
  };

  exports.login = (req, res) => {
    // 1. Validate request
  
    // 2. If VALID, find if email exists in users
    //      EXISTING USER (match retrieved)
    //        a. Check if password matches hashed password in database
    //        b. If MATCH, save info to session and redirect to home
    //        c. If NOT equal, redirect to login page with error
    //      UNREGISTERED USER (no results retrieved)
    //        a. Redirect to login page with error message
  
    // 3. If INVALID, redirect to login page with errors
    const errors = validationResult(req);
  
    if (errors.isEmpty()) {
      const {
        email,
        password
      } = req.body;
  
      userModel.getOne({ email: email }, (err, user) => {
        if (err) {
          // Database error occurred...
          req.flash('error_msg', 'Something happened! Please try again.');
          res.redirect('/');
        } else {
          // Successful query
          if (user) {
            // User found!
      
            // Check password with hashed value in the database
            bcrypt.compare(password, user.password, (err, result) => {
              // passwords match (result == true)
              if (result) {
                // Update session object once matched!
                req.session.user = user._id;
                req.session.usertype = user.usertype;
                req.session.email = user.email;
                req.session.first_name = user.first_name; 
                req.session.last_name = user.last_name;
                req.session.mobileno = user.mobileno;
                req.session.branch = user.branch;

                // if (req.session.utype === 'Regular')
                //   res.redirect('/myaccount');
                if (req.session.usertype === "Admin")
                   res.redirect('/inventory-admin'); //change path later
                  else if (req.session.usertype === "Branch Manager")
                   res.redirect('/inventory-admin'); 
              } else {
                // passwords don't match
                req.flash('error_msg', 'Incorrect password.');
                res.redirect('/');
              }
            });
          } else {
            // No user found
            req.flash('error_msg', 'Email is not registered.');
            res.redirect('/');
          }
        }
      });
    } else {
      const messages = errors.array().map((item) => item.msg);
  
      req.flash('error_msg', messages.join(' '));
      res.redirect('/');
    }
    };
  
    exports.logout = (req, res) => {
      if (req.session) {
        req.session.destroy(() => {
          res.clearCookie('connect.sid');
          res.redirect('/');
        });
      }
    };

    exports.getAll = (param, callback) =>{
      userModel.getAll(param, (err, user) => {
      if (err) throw err;
      const usersObj =[];
      user.forEach(function(doc) {
          usersObj.push(doc.toObject());
      });
      callback(usersObj);
    });
  };

  exports.getID = (req, res) => {
    var id = req;
    userModel.getByID(id, (err, result) => {
      if (err) {
        throw err;
      } else {
        var userObj = result.toObject();
        res(userObj);
      }
    });
  };
