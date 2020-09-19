const mongoose = require('./connection');

const BranchSchema = new mongoose.Schema(
  {
    branch_name: {type: String, required: true}
  }

);


const branchModel = mongoose.model('Branch', BranchSchema);

// exports.showAll = function(_id, next) {
//   branchModel.findById(_id, next);
// };

exports.getAll = (param, next) => {
  branchModel.find({}, (err, pos) => {
    next(err, pos);
  });
};
