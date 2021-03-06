'use strict';

var Firebase = require('firebase');
var express = require('express');
var router = express.Router();
var authMiddleware = require('../config/auth');
var User = require('../models/user');
var ref = new Firebase('https://20160128.firebaseio.com/');

router.post('/register', function(req, res, next) {
  User.register(req.body, function(err, userData){
    res.send(err || userData);
  });
});

router.post('/login', function(req, res, next) {
  User.login(req.body, function(err, user, token) {
    console.log('AUTHDATA', token);
    res.cookie('mytoken', token).send(user);
  });
});



router.get('/changepassword', authMiddleware, function(req, res) {
  if (!req.user) { res.render('noauth'); return; };
  User.findById(req.user._id, function(err, user) {
    res.render('form', { state: 'changepassword', title: "Change Password", user: req.user})
  });
});

router.post('/changepassword', function(req, res, next) {
  ref.changePassword({
    email: req.body.email,
    oldPassword: req.body.password,
    newPassword: req.body.newpassword
  }, function(error) {
    if (error) {
      switch (error.code) {
        case "INVALID_PASSWORD":
          console.log("The specified user account password is incorrect.");
          break;
        case "INVALID_USER":
          console.log("The specified user account does not exist.");
          break;
        default:
          console.log("Error changing password:", error);
      }
    } else {
      console.log("User password changed successfully!");
    };
  });
});

router.post('/resetpassword', function(req, res, next) {
  ref.resetPassword({
    email: req.body.email
  }, function(error) {
    if (error) {
      switch (error.code) {
        case "INVALID_USER":
          console.log("The specified user account does not exist.");
          break;
        default:
          console.log("Error resetting password:", error);
      }
    } else {
      console.log("Password reset email sent successfully!");
    }
  });
});




router.get('/logout', function(req, res, next) {
  res.clearCookie('mytoken').redirect('/');
});



router.get('/profile', authMiddleware, function(req, res) {
  if (!req.user) return res.end(); 
  User.findById(req.token._id, function(err, user) {
    res.send(user);
  });
});

module.exports = router;