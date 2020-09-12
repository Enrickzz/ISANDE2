const router = require('express').Router();
const userController = require('../controllers/userController');
const productgroupsController = require('../controllers/productgroupsController');
const productController = require('../controllers/productController');

const { registerValidation, loginValidation } = require('../validators.js');
const { isPublic, isPrivate } = require('../middlewares/checkAuth');


router.get('/home', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('home', {
    layout: 'main',
    title: 'Dashboard - Brand'
  })
});

router.get('/productgroup', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  productgroupsController.getAllpg(req, (productgroups) => {
    res.render('productgroup', { 
      layout: 'main',
      title: 'Product Groups',
      pglist: productgroups
    })
  });
});

router.get('/productgroup/view/:id', (req, res) => {
  console.log("Read view successful!");
   
  productgroupsController.getID(req, (productGroup) => {
      productController.getAllproducts(req,(products)=> {
        res.render('productgroup-card', { 
          layout:'main',
          title:"Product Groups",
          pgroup: productGroup,
          plist:products
        });
      });
    });
});

router.get('/allproducts', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  productController.getAllproducts(req, (products) => {
    res.render('products', { 
      layout: 'main',
      title: 'Products List',
      plist: products
    })
  });
});

router.get('/product/view/:id', (req, res) => {
  console.log("Read view successful!");
   
  productController.getID(req, (prod) => {
      res.render('product-card', { 
        product: prod 
      });
    });
});



router.get('/manageusers', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('manageusers', {
    layout: 'main',
    title: 'Manage Users'
  })
});

router.get('/productgroupcard', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('productgroup-card', {
    layout: 'main',
    title: '{{ Product Group }}'
  })
});

router.get('/productcard', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('product-card', {
    layout: 'main',
    title: '{{ Product name}}'
  })
});

router.get('/profile', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('profile', {
    layout: 'main',
    title: 'My Profile'
  })
});


router.post('/addProduct', productController.addProduct);

module.exports = router;