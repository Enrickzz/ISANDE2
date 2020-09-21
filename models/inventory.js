const mongoose = require('./connection');

const inventorySchema = new mongoose.Schema({
    inventorydate: { type: String, required: true },
    product: { type: String, required: true },
    startInv: { type: String, required:true},
    restockQuantity: { type: String, required:false},
    restockedInventory: { type: String, required:false},
    midDayCount: { type: String, required:false},
    midDaySales: { type: String, required:false},
    additionalRestock: { type: String, required: false },
    pulloutStock: { type: String, required:false},
    runningInventory: { type: String, required:false},
    endDayCount: { type: String, required:false},
    endDaySales: { type: String, required:false},
    returns: { type: String, required:false},
    totsales:{type:String, required:false}
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