const router = require('express').Router();
const userController = require('../controllers/userController');
const branchController = require('../controllers/branchController');
const productgroupsController = require('../controllers/productgroupsController');
const productController = require('../controllers/productController');
const productrawmaterialController = require('../controllers/productrawmaterialController');
const allRawMaterialController = require('../controllers/allRawMaterialController');
const unitofmeasureController = require('../controllers/unitofmeasureController');
const purchaseorderController = require('../controllers/purchaseorderController');
const supplierController = require('../controllers/supplierController');
const supplierListController = require('../controllers/supplierListController');
const rawMaterialOrderController = require('../controllers/rawMaterialOrderController');
const productionOrderController = require('../controllers/productionOrderController');
const branchOrderController = require('../controllers/branchorderController');
const inventoryController = require('../controllers/inventoryController');
const returnController = require('../controllers/returnController');
const returnitemsController = require('../controllers/returnitemsController');
const deliveryController = require('../controllers/deliveryController');
const pulloutorderController = require('../controllers/pulloutorderController');
const filterController = require('../controllers/filterController');

const { registerValidation, loginValidation, supplierRegisterValidation } = require('../validators.js');
const { isPublic, isPrivate } = require('../middlewares/checkAuth');

router.get('/home', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('home', {
    layout: 'main',
    title: 'Dashboard',
    fname:  req.session.first_name,
    lname:  req.session.last_name,
    utype: req.session.usertype
  })
});

router.get('/inventory-admin', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  filterController.getfilter({for:"inventory"} , (filter) =>{
    inventoryController.fetchQuery({inventorydate : filter.date , branch_id:filter.branch}, (allInventory) =>{
      res.render('inventory-admin', {
        layout: 'main',
        title: 'Inventory',
        fname:  req.session.first_name,
        lname:  req.session.last_name,
        utype: req.session.usertype,
        inventory: allInventory,
        today: filter.date,
        whichbranch : filter.branch,
        usertype: req.session.usertype
      })
    })
  })
});

router.get('/pullout-admin', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  
  pulloutorderController.getAll(req, (allpullouts)=>{
    res.render('pullout-admin', {
      layout: 'main',
      title: 'Pull Out',
      fname:  req.session.first_name,
      lname:  req.session.last_name,
      utype: req.session.usertype,
      pullouts: allpullouts
    })
  })
});

router.get('/pullout-bm', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('pullout-bm', {
    layout: 'main',
    title: 'Pull Out Products',
    fname:  req.session.first_name,
    lname:  req.session.last_name,
    utype: req.session.usertype
  })
});

router.get('/returns', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  returnController.getAll(req, (allreturns)=>{
    res.render('returns', {
      layout: 'main',
      title: 'Returns',
      fname:  req.session.first_name,
      lname:  req.session.last_name,
      utype: req.session.usertype,
      returns: allreturns
    })
  })
});

router.get('/returns/view/:id', isPrivate, function (req, res) {
  returnController.getID(req, (returnObj)=>{
    productController.getAllproducts(req, (allproducts)=>{
      var query = returnObj._id;
      returnitemsController.fetchQuery({returnID: query}, (thisIDreturns)=>{
        res.render('returns-card', {
          layout: 'main',
          title: 'Returns View',
          fname:  req.session.first_name,
          lname:  req.session.last_name,
          utype: req.session.usertype,
          return: returnObj,
          products: allproducts,
          returnitems: thisIDreturns
        });
      })
    })
  })
});

router.get('/delivery', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  deliveryController.getAll(req, (alldeliveries)=>{
    res.render('delivery', {
      layout: 'main',
      title: 'Deliveries',
      fname:  req.session.first_name,
      lname:  req.session.last_name,
      utype: req.session.usertype,
      delivery: alldeliveries
    })
  })
});


router.get('/delivery/view/:id', isPrivate, function (req, res) {
  
  deliveryController.getID(req, (deliveryObj)=>{
    branchOrderController.fetchQuery(deliveryObj.productionID, (thisdeliveryproducts)=>{
      productionOrderController.paramgetID(deliveryObj.productionID, (POobj)=>{
        res.render('delivery-card', {
          layout: 'main',
          title: 'Delivery Information',
          fname:  req.session.first_name,
          lname:  req.session.last_name,
          utype: req.session.usertype,
          delivery: deliveryObj,
          branchorders: thisdeliveryproducts,
          productionorder: POobj
        });
      })
    })
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
        utype: req.session.usertype,
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
          utype: req.session.usertype,
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
            utype: req.session.usertype,
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
      utype: req.session.usertype,
      rawList: allmaterials
    });
  });
});


router.get('/allproducts/view/:id', isPrivate, (req, res) => {
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
            utype: req.session.usertype,
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
    productController.getAllproducts(req, (allproducts)=>{
      branchOrderController.fetchQuery("buffer", (buffer)=>{
        //checker if buffer contains objs
        var checker = "true";
        if (Object.entries(buffer).length === 0) {
          checker = "false";
        }
        console.log(buffer);
        res.render('production-orders', {
          layout: 'main',
          title: 'Production Orders',
          fname:  req.session.first_name,
          lname:  req.session.last_name,
          utype: req.session.usertype,
          productionorders: allprodords,
          plist: allproducts,
          bufferBO : buffer,
          check: checker
        })
      })
    })
  })
});

router.get('/productionorder/view/:id', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  productionOrderController.getID(req, (thisPO) =>{
    var query = thisPO._id;
    branchOrderController.fetchQuery(query, (orders) =>{
      res.render('productionorder-card', {
        layout: 'main',
        title: 'Production Orders',
        fname:  req.session.first_name,
        lname:  req.session.last_name,
        utype: req.session.usertype,
        productionorder: thisPO,
        branchorders: orders
      })
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
      utype: req.session.usertype,
      suppliers: allsupplier
    })
  })
});

router.get('/supplier/view/:id', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  supplierController.getUpdateID(req, (thisSupplier) =>{
      res.render('supplier-card', {
        layout: 'main',
        title: 'Supplier Information',
        fname:  req.session.first_name,
        lname:  req.session.last_name,
        utype: req.session.usertype,
        supplier: thisSupplier
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
        utype: req.session.usertype,
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
    supplierController.getID(query, (supplierResult)=>{
      supplierListController.fetchQuery(supplierResult.company, (supplyListResult) =>{
        rawMaterialOrderController.fetchQuery(purchaseorderID, (orderedList) =>{
          res.render('purchaseorder-card', { 
            layout:'main',
            title: 'Purchase Order Information',
            fname:  req.session.first_name,
            lname:  req.session.last_name,
            utype: req.session.usertype,
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
        utype: req.session.usertype,
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
    lname:  req.session.last_name,
    utype: req.session.usertype
  })
});

router.get('/productcard', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('product-card', {
    layout: 'main',
    title: '{{ Product name}}',
    fname:  req.session.first_name,
    lname:  req.session.last_name,
    utype: req.session.usertype,
  })
});

router.get('/purchaseordercard', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('purchaseorder-card', {
    layout: 'main',
    title: '{{ Purchase Order }}',
    fname:  req.session.first_name,
    lname:  req.session.last_name,
    utype: req.session.usertype
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
              utype: req.session.usertype,
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
            utype: req.session.usertype,
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
            utype: req.session.usertype,
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
            utype: req.session.usertype,
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
        utype: req.session.usertype,
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
router.post('/supplierRegister', supplierRegisterValidation, supplierController.register);
router.post('/supplierUpdate', supplierController.update);
router.post('/supplierDelete', supplierController.delete);
router.post('/addpurchaseorder' , purchaseorderController.addPurchaseOrder);
router.post('/addRawMaterialOrder' , rawMaterialOrderController.addRMO);
router.post('/deleteRMO', rawMaterialOrderController.delete);
router.post('/status/ordered', purchaseorderController.statuschange);
router.post('/acceptproductionorder', productionOrderController.statuschangeAcc);
router.post('/rejectproductionorder', productionOrderController.statuschangeRej);
router.post('/updateRawMaterialsStock', rawMaterialOrderController.update);
router.post('/midendCountUpdate', inventoryController.midendCountUpdate);
router.post('/addreturnItem', returnitemsController.addreturnitem);
router.post('/deleteReturnItem', returnitemsController.delete);
router.post('/submitreturn', returnController.update);
router.post('/addreturn', returnController.addreturn);
router.post('/addBranchOrder', branchOrderController.addBO);
router.post('/addproductionorder', productionOrderController.addproductionorder);
router.post('/deletebufferBO', branchOrderController.delete);
router.post('/updatebranchInv', productionOrderController.statuschange4deliver);
router.post('/recieveproductionorders', inventoryController.addInventory);
router.post('/nextday', filterController.nextday);
router.post('/prevday', filterController.prevday);
router.post('/filterbranch', filterController.changebranch);

module.exports = router