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
const requestController = require('../controllers/requestController');
const suggestionsController = require('../controllers/suggestionsController');

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
    var branchquery;
    var datequery=filter.date;
    var branch="";
    var utype;
    if(req.session.usertype === "Branch Manager"){
      var todate = new Date();
      todate.setDate(todate.getDate())
      var dd = String(todate.getDate()).padStart(2, '0');
      var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = todate.getFullYear();
      todate = yyyy + '-' + mm + '-' + dd;
      
      datequery = todate;
      branchquery = req.session.branch;
      branch = req.session.branch;
      utype = "Branch Manager";
      console.log(datequery);
    }else{
      //datequery = filter.date;
      branchquery = filter.branch;
      utype = "Admin"
    }
    
    inventoryController.fetchQuery({inventorydate : datequery , branch_id:branchquery}, (allInventory) =>{
      suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for: utype}, (suggestionlist)=>{
        if(Object.entries(suggestionlist).length ===0 && Object.entries(allInventory).length ===0 && req.session.usertype== "Branch Manager"){
          res.redirect('/processinventoryforBM');
        }
        res.render('inventory-admin', {
          layout: 'main',
          title: 'Inventory',
          fname:  req.session.first_name,
          lname:  req.session.last_name,
          utype: req.session.usertype,
          inventory: allInventory,
          today: datequery,
          whichbranch : branchquery,
          usertype: req.session.usertype,
          suggestions:suggestionlist,
          num_suggestions: suggestionlist.length
        })
      })
    })
  })
});

router.get('/inventory-bm', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  filterController.getfilter({for:"inventory"} , (filter) =>{
    var branchquery;
    var datequery;
    if(req.session.usertype == "Branch Manager"){
      var todate = new Date();
      todate.setDate(todate.getDate()-1)
      var dd = String(todate.getDate()).padStart(2, '0');
      var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = todate.getFullYear();
      todate = yyyy + '-' + mm + '-' + dd;

      datequery = todate;
      branchquery = req.session.branch;
    }else{
      datequery = filter.date;
      branchquery = filter.branch;
    }
    inventoryController.fetchQuery({inventorydate : datequery , branch_id:branchquery}, (allInventory) =>{
      res.render('inventory-bm', {
        layout: 'main',
        title: 'Inventory',
        fname:  req.session.first_name,
        lname:  req.session.last_name,
        utype: req.session.usertype,
        inventory: allInventory,
        today: filter.date,
        whichbranch : branchquery,
        usertype: req.session.usertype
      })
    })
  })
});

router.get('/pullout-admin', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  
  pulloutorderController.getAll(req, (allpullouts)=>{
    
    var todate = new Date();
    var dd = String(todate.getDate()).padStart(2, '0');
    var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = todate.getFullYear();
    todate = yyyy + '-' + mm + '-' + dd;
    var datequery = todate;
    console.log(datequery);
    var branch="";
    if(req.session.usertype === "Branch Manager"){
      branch = req.session.branch;
    }
    requestController.fetchList({type: "pull-out" , date: datequery, status: "Requested"}, (reqpullout)=>{
      requestController.fetchList({type: "addstock", date: datequery,status: "Requested"}, (reqaddstock)=>{
        suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
          res.render('pullout-admin', {
            layout: 'main',
            title: 'Pull Out',
            fname:  req.session.first_name,
            lname:  req.session.last_name,
            utype: req.session.usertype,
            pullouts: allpullouts,
            reqpullout: reqpullout,
            reqaddstock: reqaddstock,
            suggestions: allsuggestions,
            num_suggestions: allsuggestions.length
          })
        })
      })
    })
  })
});

router.get('/pullout-bm', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  var todate = new Date();
  var dd = String(todate.getDate()).padStart(2, '0');
  var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = todate.getFullYear();
  todate = yyyy + '-' + mm + '-' + dd;
  var datequery = todate;
  requestController.fetchList({type: "pull-out" , date: datequery, status: "Requested"}, (reqpullout)=>{
    requestController.fetchList({type: "addstock" , date: datequery, status: "Requested"}, (reqaddstock)=>{
      inventoryController.fetchQuery({inventorydate : datequery , branch_id: req.session.branch}, (myinv)=>{
        suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: req.session.branch}, for:req.session.usertype }, (allsuggestions)=>{
          res.render('pullout-bm', {
            layout: 'main',
            title: 'Pull Out Products',
            fname:  req.session.first_name,
            lname:  req.session.last_name,
            utype: req.session.usertype,
            branch: req.session.branch,
            reqpullout: reqpullout,
            reqaddstock: reqaddstock,
            inventory: myinv,
            suggestions: allsuggestions,
            num_suggestions: allsuggestions.length
          })
        })
      })
    })
  })
});

router.get('/pulloutorder/view/:id', (req, res) => {
  console.log("Read view successful!");
  pulloutorderController.getID(req, (pullouts) => {
    var branch="";
    if(req.session.usertype === "Branch Manager"){
      branch = req.session.branch;
    }
    suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
      var query = pullouts._id;
      res.render('pullout-card', { 
        layout:'main',
        title: 'Pullout Order View',
        fname:  req.session.first_name,
        lname:  req.session.last_name,
        utype: req.session.usertype,
        pullouts: pullouts,
        suggestions: allsuggestions,
        num_suggestions: allsuggestions.length
      });
    })
  });
});

router.get('/returns', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  returnController.getAll(req, (allreturns)=>{
    var branch="";
    if(req.session.usertype === "Branch Manager"){
      branch = req.session.branch;
    }
    suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
      res.render('returns', {
        layout: 'main',
        title: 'Returns',
        fname:  req.session.first_name,
        lname:  req.session.last_name,
        utype: req.session.usertype,
        returns: allreturns,
        suggestions: allsuggestions,
        num_suggestions: allsuggestions.length
      })
    })
  })
});

router.get('/returns/view/:id', isPrivate, function (req, res) {
  returnController.getID(req, (returnObj)=>{
    productController.getAllproducts(req, (allproducts)=>{
      var query = returnObj._id;
      returnitemsController.fetchQuery({returnID: query}, (thisIDreturns)=>{
        var branch="";
        if(req.session.usertype === "Branch Manager"){
          branch = req.session.branch;
        }
        suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
          res.render('returns-card', {
            layout: 'main',
            title: 'Returns View',
            fname:  req.session.first_name,
            lname:  req.session.last_name,
            utype: req.session.usertype,
            return: returnObj,
            products: allproducts,
            returnitems: thisIDreturns,
            suggestions: allsuggestions,
            num_suggestions: allsuggestions.length
          });
        })
      })
    })
  })
});

router.get('/delivery', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  deliveryController.getAll(req, (alldeliveries)=>{
    var branch="";
    if(req.session.usertype === "Branch Manager"){
      branch = req.session.branch;
    }
    suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
        res.render('delivery', {
        layout: 'main',
        title: 'Deliveries',
        fname:  req.session.first_name,
        lname:  req.session.last_name,
        utype: req.session.usertype,
        delivery: alldeliveries,
        suggestions: allsuggestions,
        num_suggestions: allsuggestions.length
      })
    })
  })
});


router.get('/delivery/view/:id', isPrivate, function (req, res) {
  
  deliveryController.getID(req, (deliveryObj)=>{
    branchOrderController.fetchQuery(deliveryObj.productionID, (thisdeliveryproducts)=>{
      productionOrderController.paramgetID(deliveryObj.productionID, (POobj)=>{
        requestController.getID(deliveryObj.productionID, (requestdelivery) =>{
          var reqid;
          if(requestdelivery){
            reqid = requestdelivery._id
          }else{
            reqid="0";
          }
          console.log(reqid);
          pulloutorderController.fetchOne({item: reqid}, (POorder)=>{
            var branch="";
            if(req.session.usertype === "Branch Manager"){
              branch = req.session.branch;
            }
            suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
              res.render('delivery-card', {
                layout: 'main',
                title: 'Delivery Information',
                fname:  req.session.first_name,
                lname:  req.session.last_name,
                utype: req.session.usertype,
                delivery: deliveryObj,
                branchorders: thisdeliveryproducts,
                productionorder: POobj,
                request: requestdelivery,
                pulloutOrder: POorder,
                suggestions: allsuggestions,
                num_suggestions: allsuggestions.length  
              });
            })
          })
        })
      })
    })
  })
});

router.get('/productgroup', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template //make productmodel function to return ungrouped products
  productgroupsController.getAllpg(req, (productgroups) => { 
    productController.getAllproducts(req, (products) => {
      var branch="";
      if(req.session.usertype === "Branch Manager"){
        branch = req.session.branch;
      }
      suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
        res.render('productgroup', {  
          layout: 'main',
          title: 'Product Groups',
          fname:  req.session.first_name,
          lname:  req.session.last_name,
          utype: req.session.usertype,
          pglist: productgroups,
          plist:products,
          suggestions: allsuggestions,
          num_suggestions: allsuggestions.length
        })
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
        var branch="";
        if(req.session.usertype === "Branch Manager"){
          branch = req.session.branch;
        }
        suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
          res.render('productgroup-card', { 
            layout:'main',
            title:"Product Groups",
            fname:  req.session.first_name,
            lname:  req.session.last_name,
            utype: req.session.usertype,
            ungroupedProd: ungroupedProducts,
            pgroup: productGroup,
            plist: pgproducts,
            suggestions: allsuggestions,
            num_suggestions: allsuggestions.length
          });
        })
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
          var branch="";
          if(req.session.usertype === "Branch Manager"){
            branch = req.session.branch;
          }
          suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
            res.render('products', { 
              layout: 'main',
              title: 'Products List',
              fname:  req.session.first_name,
              lname:  req.session.last_name,
              utype: req.session.usertype,
              plist: products,
              pglist: productgroups,
              allRawMat: allmaterials,
              unitofmeasure: allUOM,
              suggestions: allsuggestions,
              num_suggestions: allsuggestions.length
            })
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
    var branch="";
    if(req.session.usertype === "Branch Manager"){
      branch = req.session.branch;
    }
    suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
      res.render('raw-materials', {
        layout: 'main',
        title: 'Raw Materials',
        fname:  req.session.first_name,
        lname:  req.session.last_name,
        utype: req.session.usertype,
        rawList: allmaterials,
        suggestions: allsuggestions,
        num_suggestions: allsuggestions.length
      });
    })
  });
});


router.get('/allproducts/view/:id', isPrivate, (req, res) => {
  console.log("Read view successful!");
  
  productController.getID(req, (prod) => {
    var query = prod._id;
    productrawmaterialController.getRawMaterials(query,(materials) => {
      allRawMaterialController.getAllmaterials(req,(allMaterials) => {
        unitofmeasureController.getAll(req, (allUOM) => {
          var branch="";
          if(req.session.usertype === "Branch Manager"){
            branch = req.session.branch;
          }
          suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
            res.render('product-card', { 
              layout:'main',
              title: prod.name,
              fname:  req.session.first_name,
              lname:  req.session.last_name,
              utype: req.session.usertype,
              product: prod,
              rawList: materials,
              allMat: allMaterials,
              unitofmeasure: allUOM,
              suggestions: allsuggestions,
              num_suggestions: allsuggestions.length
            });
          })
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
        var branch="";
        if(req.session.usertype === "Branch Manager"){
          branch = req.session.branch;
        }
        suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
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
            check: checker,
            suggestions: allsuggestions,
            num_suggestions: allsuggestions.length
          })
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
      var branch="";
      if(req.session.usertype === "Branch Manager"){
        branch = req.session.branch;
      }
      suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
        res.render('productionorder-card', {
          layout: 'main',
          title: 'Production Orders',
          fname:  req.session.first_name,
          lname:  req.session.last_name,
          utype: req.session.usertype,
          productionorder: thisPO,
          branchorders: orders,
          suggestions: allsuggestions,
          num_suggestions: allsuggestions.length
        })
      })
    })
  })
});

router.get('/supplier', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  supplierController.getAll(req, (allsupplier) =>{
    var branch="";
    if(req.session.usertype === "Branch Manager"){
      branch = req.session.branch;
    }
    suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
      res.render('supplier', {
        layout: 'main',
        title: 'Suppliers',
        fname:  req.session.first_name,
        lname:  req.session.last_name,
        utype: req.session.usertype,
        suppliers: allsupplier,
        suggestions: allsuggestions,
        num_suggestions: allsuggestions.length
      })
    })
  })
});

router.get('/supplier/view/:id', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  supplierController.getUpdateID(req, (thisSupplier) =>{
    var branch="";
    if(req.session.usertype === "Branch Manager"){
      branch = req.session.branch;
    }
    suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
      res.render('supplier-card', {
        layout: 'main',
        title: 'Supplier Information',
        fname:  req.session.first_name,
        lname:  req.session.last_name,
        utype: req.session.usertype,
        supplier: thisSupplier,
        suggestions: allsuggestions,
        num_suggestions: allsuggestions.length
      })
    })
  })
});

router.get('/purchaseorder', isPrivate, function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  purchaseorderController.getAll(req, (POs) =>{
    supplierController.getAll(req, (allSuppliers) =>{
      var branch="";
      if(req.session.usertype === "Branch Manager"){
        branch = req.session.branch;
      }
      suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
        res.render('purchase-orders', {
          layout: 'main',
          title: 'Purchase Orders',
          fname:  req.session.first_name,
          lname:  req.session.last_name,
          utype: req.session.usertype,
          purchaseorder: POs,
          supplier: allSuppliers,
          suggestions: allsuggestions,
          num_suggestions: allsuggestions.length
        })
      })
    })
  })
});

router.get('/purchaseorder/view/:id', (req, res) => {
  console.log("Read view successful!");
  purchaseorderController.getID(req, (POs) => {
    // var query = POs.supplier;
    var purchaseorderID = POs._id;
    // supplierController.getID(query, (supplierResult)=>{
      supplierListController.fetchQuery(POs.supplier, (supplyListResult) =>{
        rawMaterialOrderController.fetchQuery(purchaseorderID, (orderedList) =>{
          var branch="";
          if(req.session.usertype === "Branch Manager"){
            branch = req.session.branch;
          }
          suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
            res.render('purchaseorder-card', { 
              layout:'main',
              title: 'Purchase Order Information',
              fname:  req.session.first_name,
              lname:  req.session.last_name,
              utype: req.session.usertype,
              purchaseorder: POs,
              supplyList: supplyListResult,
              supplier: POs.supplier,
              rawMaterialOrders: orderedList,
              suggestions: allsuggestions,
              num_suggestions: allsuggestions.length
            });
          })
        })
      // })
    })
  });
});


router.get('/manageusers', isPrivate, function(req, res) {
      // The render function takes the template filename (no extension - that's what the config is for!)
      // and an object for what's needed in that template
      userController.getAll(req, (users) =>{
      branchController.getAll(req, (branches) =>{
        var branch="";
        if(req.session.usertype === "Branch Manager"){
          branch = req.session.branch;
        }
        suggestionsController.fetchQuery({status:"Unresolved", tobranch:{$regex: branch}, for:req.session.usertype}, (allsuggestions)=>{
          res.render('manageusers', {
            layout: 'main',
            title: 'Manage Users',
            fname:  req.session.first_name,
            lname:  req.session.last_name,
            utype: req.session.usertype,
            userlist: users,
            branchlist: branches,
            suggestions: allsuggestions,
            num_suggestions: allsuggestions.length
          })
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

var getDates = function(startDate, endDate) {
  var dates = [],
      currentDate = startDate,
      addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
  while (currentDate <= endDate) {
    var todate = new Date();
    todate.setDate(currentDate.getDate())
    var dd = String(todate.getDate()).padStart(2, '0');
    var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = todate.getFullYear();
    todate = yyyy + '-' + mm + '-' + dd;
    dates.push(todate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

router.get('/processinventory/:id', isPrivate, (req,res) => {
  var totquantity = parseFloat("0");
  var todate = new Date();
  var y = todate.getFullYear(), m =String(todate.getMonth() + 1).padStart(2, '0'), d=String(todate.getDate()).padStart(2, '0');
  todate.setDate(todate.getDate()-1)
  var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
  var dd = String(todate.getDate()).padStart(2, '0');
  var yyyy = todate.getFullYear();

  var start = new Date()
  start.setDate(start.getDate()-7);
  var sM = String(start.getMonth() + 1).padStart(2, '0'); //January is 0!
  var sD = String(start.getDate()).padStart(2, '0');
  var sY = start.getFullYear();
  
  
  var daterange = getDates(new Date(sY,sM,sD), new Date(yyyy,mm,dd));
  console.log(daterange);
  productionOrderController.getID(req, (thisPO)=>{
    console.log(thisPO);
    branchOrderController.fetchQuery(thisPO._id, (thisPObranchorders)=>{
      console.log(thisPObranchorders);
      thisPObranchorders.forEach(function(obj){
        inventoryController.fetchQuery({branch_id: thisPO.branch,product: obj.product, inventorydate: daterange}, (result)=>{
          for(var i = 0 ; i < result.length; i++){
            totquantity = totquantity+ parseFloat(result[i].restockedInventory) + parseFloat(result[i].additionalRestock) 
                          + parseFloat(result[i].pulloutStock) - parseFloat(result[i].endDayCount);
            console.log(result[i].inventorydate +"loop tot: "+totquantity);
          }
          console.log(totquantity);
          var average = totquantity/result.length;
          var basis =average - obj.quantity; console.log(basis);
          if(basis > obj.quantity*.10 || basis < (obj.quantity*.10)*-1){
            
            var makesuggestion={
              date: y+"-"+m+"-"+d,
              for: "Admin",
              tobranch: thisPO.branch,
              suggestion: thisPO.branch+" ordered " + obj.quantity + " Piece/s " +obj.product+". Average sold quantity: "+Math.floor(average),
              status: "Unresolved",
              type:"Production"
            }
            suggestionsController.makesuggestions(makesuggestion, (suggestion)=>{
              console.log("LOG: " + thisPO.branch+" ordered " + obj.quantity + " Piece/s " +obj.product+". Average sold quantity: "+Math.floor(average));
              console.log("Recommendation: Change quantity of order to " +average +"."   );
            })
            //console.log("LOG: " + thisPO.branch+" ordered " + obj.quantity + " Piece/s " +obj.product+". Average sold quantity: "+average);
            //console.log("Recommendation: Change quantity of order to " +average +"."   );
          }else{
            console.log("NO NEED")
          }
          totquantity= parseFloat("0");
        })
      })
    })
  })
  res.redirect('/inventory-admin');
})

router.get('/processinventoryforBM', isPrivate, (req,res)=>{
  var totquantity = parseFloat("0");
  var todate = new Date();
  var y = todate.getFullYear(), m =String(todate.getMonth() + 1).padStart(2, '0'), d=String(todate.getDate()).padStart(2, '0');
  todate.setDate(todate.getDate()-1)
  var mm = String(todate.getMonth() + 1).padStart(2, '0'); //January is 0!
  var dd = String(todate.getDate()).padStart(2, '0');
  var yyyy = todate.getFullYear();

  var start = new Date()
  start.setDate(start.getDate()-7);
  var sM = String(start.getMonth() + 1).padStart(2, '0'); //January is 0!
  var sD = String(start.getDate()).padStart(2, '0');
  var sY = start.getFullYear();
  var daterange = getDates(new Date(sY,sM,sD), new Date(yyyy,mm,dd));
  
  inventoryController.fetchProducts({branch_id: req.session.branch, inventorydate: yyyy+"-"+mm+"-"+dd }, (productlist)=>{
    productlist.forEach(function(obj){
      inventoryController.fetchQuery({branch_id: req.session.branch,product: obj, inventorydate: daterange}, (result)=>{
        for(var i = 0 ; i < result.length; i++){
          totquantity = totquantity+ parseFloat(result[i].restockedInventory) + parseFloat(result[i].additionalRestock) 
                        + parseFloat(result[i].pulloutStock) - parseFloat(result[i].endDayCount);
          console.log(result[i].inventorydate +"loop tot: "+totquantity);
        }
        console.log(totquantity);
        var average = totquantity/result.length;
        //var basis =average - obj.quantity; console.log(basis);
        var makesuggestion={
          date: y+"-"+m+"-"+d,
          for: "Branch Manager",
          tobranch: req.session.branch,
          suggestion: req.session.branch+" has sold " + Math.floor(average) + " Piece/s of " +obj+" in the last 7 days. Order "+Math.floor(average)+" Piece/s.",
          status: "Unresolved",
          type: "Production"
        }
        suggestionsController.makesuggestions(makesuggestion, (suggestion)=>{
          console.log(result.branch_id+" has sold " + average + " Piece/s of " +result.product+" in the last 7 days. Order "+average+" Piece/s.");
          //console.log("Recommendation: Change quantity of order to " +average +"."   );
        })
        totquantity= parseFloat("0");
      })
    })
  })
  res.redirect('/inventory-admin');
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
router.post('/updateBranchOrder', branchOrderController.updateBO);
router.post('/addproductionorder', productionOrderController.addproductionorder);
router.post('/deletebufferBO', branchOrderController.delete);
router.post('/updatebranchInv', productionOrderController.statuschange4deliver);
router.post('/recieveproductionorders', inventoryController.addInventory);
router.post('/nextday', filterController.nextday);
router.post('/prevday', filterController.prevday);
router.post('/filterbranch', filterController.changebranch);
router.post('/pulloutorder', pulloutorderController.create);
router.post('/pulloutupdate', inventoryController.pulloutUpdate);
router.post('/addtoreqlist', requestController.create);

module.exports = router