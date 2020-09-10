const productgroupsModel = require('../models/productgroups');
const { validationResult } = require('express-validator');

exports.getAllPosts = (param, callback) =>{
    productgroupsModel.getAll(param, (err, posts) => {
      if (err) throw err;
      
      const pgObjects = [];
      
      posts.forEach(function(doc) {
        pgObjects.push(doc.toObject());
      });
      
      callback(pgObjects);
    });
  };
