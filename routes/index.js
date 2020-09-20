const router = require('express').Router();
const userController = require('../controllers/userController');
const branchController = require('../controllers/branchController');
const productgroupsController = require('../controllers/productgroupsController');
const productconnectionController = require('../controllers/productconnectionController');
const productController = require('../controllers/productController');
const productrawmaterialController = require('../controllers/productrawmaterialController');
const allRawMaterialController = require('../controllers/allRawMaterialController');
const unitofmeasureController = require('../controllers/unitofmeasureController');
const purchaseorderController = require('../controllers/purchaseorderController');
const supplierController = require('../controllers/supplierController');
const supplierListController = require('../controllers/supplierListController');
const rawMaterialOrderController = require('../controllers/rawMaterialOrderController');
const productionOrderController = require('../controllers/productionOrderController');

const { registerValidation, loginValidation } = require('../validators.js');
const { isPublic, isPrivate } = require('../middlewares/checkAuth');

router.get('/home', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('home', {
    layout: 'main',
    title: 'Dashboard',
    fname:  req.session.first_name,
    lname:  req.session.last_name,
  })
});

router.get('/inventory', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('inventory', {
    layout: 'main',
    title: 'Inventory'
  })
});

router.get('/productgroup', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template //make productmodel function to return ungrouped products
  productgroupsController.getAllpg(req, (productgroups) => { 
    productController.getAllproducts(req, (products) => {
      res.render('productgroup', {  
        layout: 'main',
        title: 'Product Groups',
        fname:  req.session.first_name,
        lname:  req.session.last_name,
        pglist: productgroups,
        plist:products
      })
    })
  });
});

router.get('/productgroup/view/:id', isPrivate, (req, res) => {
  console.log("Read view successful!");
  
  productgroupsController.getID(req, (productGroup) => {
    var query = productGroup._id; // this is the connection of products to its group
    productController.getGroupProducts(query,(pgproducts)=>{
      console.log("LIST OF CONNECTIONS : ");
      console.log(pgproducts); 
      productController.getGroupProducts("Ungrouped", (ungroupedProducts) => {
        res.render('productgroup-card', { 
          layout:'main',
          title:"Product Groups",
          fname:  req.session.first_name,
          lname:  req.session.last_name,
          ungroupedProd: ungroupedProducts,
          pgroup: productGroup,
          plist: pgproducts
        });
      })
    })
  });
});

router.get('/allproducts', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  productController.getAllproducts(req, (products) => {
    productgroupsController.getAllpg(req,(productgroups) =>{
      allRawMaterialController.getAllmaterials(req, (allmaterials) => {
        unitofmeasureController.getAll(req, (allUOM) => {
          res.render('products', { 
            layout: 'main',
            title: 'Products List',
            fname:  req.session.first_name,
            lname:  req.session.last_name,
            plist: products,
            pglist: productgroups,
            allRawMat: allmaterials,
            unitofmeasure: allUOM
          })
        })
      })
    })
  });
});

router.get('/rawmaterials', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  allRawMaterialController.getAllmaterials(req, (allmaterials) =>{
    res.render('raw-materials', {
      layout: 'main',
      title: 'Raw Materials',
      fname:  req.session.first_name,
      lname:  req.session.last_name,
      rawList: allmaterials
    });
  });
});


router.get('/product/view/:id', isPrivate, (req, res) => {
  console.log("Read view successful!");
  
  productController.getID(req, (prod) => {
    var query = prod._id;
    productrawmaterialController.getRawMaterials(query,(materials) => {
      allRawMaterialController.getAllmaterials(req,(allMaterials) => {
        unitofmeasureController.getAll(req, (allUOM) => {
          res.render('product-card', { 
            layout:'main',
            title: prod.name,
            fname:  req.session.first_name,
            lname:  req.session.last_name,
            product: prod,
            rawList: materials,
            allMat: allMaterials,
            unitofmeasure: allUOM
          });
        })
      });
    })
  });
});

router.get('/productionorder', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  productionOrderController.getAll(req, (allprodords) =>{
    res.render('production-orders', {
      layout: 'main',
      title: 'Production Orders',
      fname:  req.session.first_name,
      lname:  req.session.last_name,
      productionorders: allprodords
    })
  })
});

router.get('/supplier', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  supplierController.getAll(req, (allsupplier) =>{
    res.render('supplier', {
      layout: 'main',
      title: 'Suppliers',
      fname:  req.session.first_name,
      lname:  req.session.last_name,
      suppliers: allsupplier
    })
  })
});

router.get('/purchaseorder', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  purchaseorderController.getAll(req, (POs) =>{
    supplierController.getAll(req, (allSuppliers) =>{
      res.render('purchase-orders', {
        layout: 'main',
        title: 'Purchase Orders',
        fname:  req.session.first_name,
        lname:  req.session.last_name,
        purchaseorder: POs,
        supplier: allSuppliers
      })
    })
  })
});

router.get('/purchaseorder/view/:id', (req, res) => {
  console.log("Read view successful!");
  purchaseorderController.getID(req, (POs) => {
    var query = POs.supplierID;
    var purchaseorderID = POs._id;
    supplierListController.fetchQuery(query, (supplyListResult) =>{
      supplierController.getID(query, (supplierResult)=>{
        rawMaterialOrderController.fetchQuery(purchaseorderID, (orderedList) =>{
          res.render('purchaseorder-card', { 
            layout:'main',
            title: 'Purchase Order View',
            fname:  req.session.first_name,
            lname:  req.session.last_name,
            purchaseorder: POs,
            supplyList: supplyListResult,
            supplier: supplierResult,
            rawMaterialOrders: orderedList
          });
        })
      })
    })
  });
});


router.get('/manageusers', isPrivate, function(req, res) {
      // The render function takes the template filename (no extension - that's what the config is for!)
      // and an object for what's needed in that template
      userController.getAll(req, (users) =>{
      branchController.getAll(req, (branches) =>{
      res.render('manageusers', {
        layout: 'main',
        title: 'Manage Users',
        fname:  req.session.first_name,
        lname:  req.session.last_name,
        userlist: users,
        branchlist: branches
      })
    });
  });
});

router.get('/productgroupcard', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('productgroup-card', {
    layout: 'main',
    title: '{{ Product Group }}',
    fname:  req.session.first_name,
    lname:  req.session.last_name
  })
});

router.get('/productcard', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('product-card', {
    layout: 'main',
    title: '{{ Product name}}',
    fname:  req.session.first_name,
    lname:  req.session.last_name
  })
});

router.get('/purchaseordercard', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('purchaseorder-card', {
    layout: 'main',
    title: '{{ Purchase Order }}',
    fname:  req.session.first_name,
    lname:  req.session.last_name
  })
});

router.get('/profile', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('profile', {
    layout: 'main',
    title: 'My Profile',
    fname:  req.session.first_name,
    lname:  req.session.last_name,
    email:  req.session.email,
    usertype:  req.session.email,
    mnum: req.session.mobileno,
    utype: req.session.usertype,
    branch: req.session.branch
    
  })
});



//.get/s below are redirected from other functions from specific controllers so that it will connect with other controllers
router.get('/PGiterate/:id', isPrivate, (req, res) => {
  productController.getID(req, (prod) => {
    var query = prod.product_groupID;
    productgroupsController.incrementNumProd(query, (counted) => {
      var query2 = prod._id;
      productrawmaterialController.getRawMaterials(query2, (productRawMat) => {
        allRawMaterialController.getAllmaterials(req,(allmaterials) =>{
          unitofmeasureController.getAll(req, (allUOM) =>{
            res.render('product-card', {
              layout: 'main',
              title: prod.name,
              fname:  req.session.first_name,
              lname:  req.session.last_name,
              product: prod,
              rawList: productRawMat,
              allMat: allmaterials,
              unitofmeasure: allUOM
            })
          })
        })
      })
    })
  });
});
router.get('/PGdecrementA/:id', isPrivate, (req, res) => {
  productgroupsController.getID(req, (productGroup) => {
    var query = productGroup._id;
    productgroupsController.decrementNumProd(query, (counted) => {
      productgroupsController.getAllpg(req, (productgroups) => {
        productController.getAllproducts(req, (productlist) => {
          res.render('products', {
            layout: 'main',
            title: 'Product Groups',
            fname:  req.session.first_name,
            lname:  req.session.last_name,
            pglist: productgroups,
            plist: productlist
          })
        })
      })
    })
  });
});

router.get('/PGincrement/:id', isPrivate, (req, res) => {
  productgroupsController.getID(req, (productGroup) => {
    var query = productGroup._id;
    productgroupsController.incrementNumProd(query, (counted) => {
      productController.getGroupProducts(query, (productlist) => {
        productController.getGroupProducts("Ungrouped", (ungroupedproducts) => {
          res.render('productgroup-card', {
            layout: 'main',
            title: 'Product Groups',
            fname:  req.session.first_name,
            lname:  req.session.last_name,
            pgroup: productGroup,
            ungroupedProd: ungroupedproducts,
            plist: productlist
          })
        })
      })
    })
  });
});

router.get('/PGDecrement/:id', isPrivate, (req, res) => {
  
  productgroupsController.getID(req, (productGroup) => {
    var query = productGroup._id;
    productgroupsController.decrementNumProd(query, (counted) => {
      productController.getGroupProducts(query, (productlist) => {
        productController.getGroupProducts("Ungrouped", (ungroupedproducts) => {
          res.render('productgroup-card', {
            layout: 'main',
            title: 'Product Groups',
            fname:  req.session.first_name,
            lname:  req.session.last_name,
            pgroup: productGroup,
            ungroupedProd: ungroupedproducts,
            plist: productlist
          })
        })
      })
    })
  });
});

router.get('/deletefromProd/:id', isPrivate, (req,res) => {
  var query = req;
  console.log(query);
  productrawmaterialController.deleteMatNoLongerExists(req, (result) =>{
    allRawMaterialController.getAllmaterials(req, (allmaterials) =>{
      res.render('raw-materials', {
        layout: 'main',
        title: 'Raw Materials',
        fname:  req.session.first_name,
        lname:  req.session.last_name,
        rawList: allmaterials
      });
    })
  })
})



router.post('/addProduct' , productController.addProduct);
router.post('/addMaterial', allRawMaterialController.addMaterial);
router.post('/addGroup', productgroupsController.addGroup);
router.post('/productNewMaterial', productrawmaterialController.addMaterial);
router.post('/removeFrmProdGrp', productController.ungroup);
router.post('/addProdtoPG', productController.assigngroup);
router.post('/removematfromProduct',productrawmaterialController.delete);
router.post('/deleteProduct',productController.delete);
router.post('/deleteMaterial', allRawMaterialController.delete);
router.post('/deleteGroup' , productgroupsController.delete);
router.post('/register', registerValidation, userController.register);
router.post('/addpurchaseorder' , purchaseorderController.addPurchaseOrder);
router.post('/addRawMaterialOrder' , rawMaterialOrderController.addRMO);
router.post('/deleteRMO', rawMaterialOrderController.delete)

module.exports = router;