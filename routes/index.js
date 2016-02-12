var express = require('express');
var router = express.Router();
var authMiddleware = require('../config/auth');

/* GET home page. */
router.get('/', authMiddleware, function(req, res, next) {
  console.log("req.user: ", req.user);
  console.log("cookies: ", req.cookies);
  res.render('index');
});

router.get('/logout', function(req, res, next) {
  res.clearCookie('mytoken').redirect('/');
});


// router.get('/register', function(req, res, next) {
//   var token = req.cookies.mytoken;
//   if(token) return res.redirect("/dashboard");
//   res.render('register');
// });

// router.get('/login', function(req, res, next) {
//   var token = req.cookies.mytoken;
//   if(token) return res.redirect("/dashboard");
//   res.render('login');
// });


module.exports = router;
