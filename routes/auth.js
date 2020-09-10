const router = require('express').Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation } = require('../validators.js');
const { isPublic, isPrivate } = require('../middlewares/checkAuth');

// Importing the controllers
//const movieController = require('../controllers/movieController');
//const screeningController = require('../controllers/screeningController');

// Home/movies route
router.get('/', isPublic, function(req, res) {
    res.render('login-page', {
        layout: 'login',
        title: 'Login - Louella Bakery'
      })
});

// // POST methods for form submissions
// //router.post('/register', isPublic, userController.registerUser);
// router.post('/register', isPublic, registerValidation, userController.register);
router.post('/login', isPublic, loginValidation, userController.login);

// // logout
// router.get('/logout', isPrivate, userController.logout);

module.exports = router;