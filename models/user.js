const mongoose = require('./connection');

const UserSchema = new mongoose.Schema({
    usertype: { type: String, required: [true, "No Usertype provided"] },
    email: { type: String, required: [true, "No Email Address provided"]},
    first_name: { type: String, required: [true, "No First Name provided"] },
    last_name: { type: String, required: [true, "No Last Name provided"] },
    mobileno: { type: String, required: [true, "No Mobile Number provided"]},
    password: { type: String, required: [true, "No Password provided"]},
    branchID: {type: mongoose.Schema.Types.ObjectId, ref: 'Branch'}
  }
);

const userModel = mongoose.model('users', UserSchema);


// Saving a user given the validated object
exports.register = function(obj, next) {
  const user = new userModel(obj);
  
  user.save(function(err, user) {
    next(err, user);
  });
}

// Retrieving a user based on ID
exports.getById = function(id, next) {
  userModel.findById(id, function(err, user) {
    next(err, user);
  });
};

// Retrieving just ONE user based on a query (first one)
exports.getOne = function(query, next) {
  userModel.findOne(query, function(err, user) {
    next(err, user);
  });
};