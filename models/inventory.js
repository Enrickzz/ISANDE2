const mongoose = require('./connection');

const inventorySchema = new mongoose.Schema({
    inventorydate: { type: String, required: true },
    product: { type: String, required: true },
    startInv: { type: String, required:true},
    restockQuantity: { type: String, required:false, default:"0"},
    restockedInventory: { type: String, required:false, default:"0"},
    midDayCount: { type: String, required:false, default:"0"},
    midDaySales: { type: String, required:false, default:"0"},
    additionalRestock: { type: String, required: false , default:"0"},
    pulloutStock: { type: String, required:false, default:"0"},
    runningInventory: { type: String, required:false, default:"0"},
    endDayCount: { type: String, required:false, default:"0"},
    endDaySales: { type: String, required:false, default:"0"},
    returns: { type: String, required:false, default:"0"},
    totsales:{type:String, required:false, default:"0"}
  }
);

const inventoryModel = mongoose.model('inventory', inventorySchema, 'inventory');

exports.getAll = (param, next) => {
    inventoryModel.find({}, (err, inventory) => {
      next(err, inventory);
    });
  };

exports.fetchList = function(query, next) {
    inventoryModel.find(query, function(err, orders) {
      next(err, orders);
    });
  };