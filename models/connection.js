// This file is initializing the mongodb connection
// and exporting it for use in all other files through the module.exports

const mongoose = require('mongoose');
const { dbURL } = require('../config');

const options = { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false };

mongoose.connect(dbURL, options);

module.exports = mongoose;
