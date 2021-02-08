// All imports needed here
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const bodyParser = require('body-parser');
const mongoose = require('./models/connection');
//For sessions
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);

// Routes imports
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');

const { envPort, sessionKey } = require('./config');

// Creates the express application
const app = express();
const port = envPort || 3000;

// Listening to the port provided
app.listen(port, () => {
  console.log('App listening at port ' + port)
});

// Creates an engine called "hbs" using the express-handlebars package.
app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultView: 'main',
  layoutsDir: path.join(__dirname, '/views/layouts'),
  partialsDir: path.join(__dirname, '/views/partials'),
  helpers: {
    if_eq: function(a, b, opts) {
      if(a == b) // Or === depending on your needs
        return opts.fn(this);
      else
       return opts.inverse(this);
    },

    addComma: function(num){
      // Convert input string to a number and store as a variable.
      var value = parseFloat(num);      
      var formattedString= value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      return formattedString;
    },
    addZeroesComma: function(num){
      // Convert input string to a number and store as a variable.
      var value = parseFloat(num).toFixed(2);      
      var formattedString= value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      return formattedString;
    }
  }
}));

// Setting the view engine to the express-handlebars engine we created
app.set('view engine', 'hbs');

// Configuration for handling API endpoint data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// serve static files
app.use(express.static('public'));

// Insert server configuration after this comment
// Sessions
app.use(session({
  secret: sessionKey,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

// Flash
app.use(flash());

// Global messages vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});


app.use('/', authRouter); // Login/registration routes
app.use('/', indexRouter); // Main index route
