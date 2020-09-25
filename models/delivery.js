const mongoose = require('./connection');

const deliverySchema = new mongoose.Schema({
    deliverydate: { type: String, required: true },
    productionID: { type: String, required:true},
    total: { type: String, required:true},
    status: { type: String, required:true},
    type: { type: String, required:false},
  }
);

const deliveryModel = mongoose.model('delivery', deliverySchema, 'delivery');


exports.getAll = (param, next) => {
    deliveryModel.find({}, (err, pos) => {
      next(err, pos);
    });
  };

  exports.getByID = function(query, next) {
    deliveryModel.findById(query, function(err, post) {
      next(err, post);
    });
  };
exports.create = function(obj, next) {
    const delivery = new deliveryModel(obj);
    console.log(delivery);
    delivery.save(function(err, delivery_result) {
      console.log(err);
      next(err, delivery_result);
    });
  };
  exports.update = function(query, update, next) {
    deliveryModel.findOneAndUpdate(query, update, { new: true }, function(err, res) {
      next(err, res);
    })
  };