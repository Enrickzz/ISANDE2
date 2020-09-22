exports.isPrivate = (req, res, next) => {
    // Must be authenticated to go to the next function
    if (req.session.user) {
      return next()
    } else {
      res.redirect('/');
    }
  };
  
  exports.isPublic = (req, res, next) => {
    // If authenticated, go to user's myaccount page
    if (req.session.user) {
      res.redirect('/inventory-admin'); // change path later
    } else {
      return next();
    }
  }