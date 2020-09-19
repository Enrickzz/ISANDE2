const { body } = require('express-validator');

const registerValidation = [
  // usertype should not be empty
  body('usertype').not().isEmpty().withMessage("Usertype is required."),

   // first_name should not be empty
   body('first_name').not().isEmpty().withMessage("First name is required."),

   // last_name should not be empty
   body('last_name').not().isEmpty().withMessage("Last name is required."),
   
   // mobileno should not be empty
   body('mobileno').not().isEmpty().withMessage("Mobile Number is required."),

  // email should not be empty and must be a valid email
  body('email').not().isEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please provide a valid email."),

  // password should not be empty
  body('password').not().isEmpty().withMessage("Password is required"),

  // branch should not be empty
  body('branch').not().isEmpty().withMessage("Branch is required."),

  // confirmpassword must match the req.body.password field
  body('confirmpassword').not().isEmpty().withMessage("Password is required.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match.");
      }
      return true;
    })
];

const loginValidation = [
   // Email should not be empty
   body('email').not().isEmpty().withMessage("Email is required."),
    // Password should not be empty
    body('password').not().isEmpty().withMessage("Password is required")
  ];
  
// update exports
module.exports = { registerValidation, loginValidation };