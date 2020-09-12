const mongoose = require('./connection');

const productConnectionSchema = new mongoose.Schema({
    productID: { type: String, required: true },
    product_groupID: { type: String, required:false} //== productgroup._id (if any)
  }
);

const PCmodel = mongoose.model('productconnection', productConnectionSchema);

exports.createConnection = function(obj, next) {
    const conn = new PCmodel(obj);
    console.log(conn);
    conn.save(function(err, conn) {
      console.log(err);
      next(err, conn);
    });
  };