'use strict';

var mongoose = require('mongoose');
var Firebase = require('firebase');
var jwt = require('jwt-simple');
var moment = require('moment');

var JWT_SECRET = process.env.JWT_SECRET;

var ref = new Firebase('https://20160128.firebaseio.com/')

var User;

var userSchema = mongoose.Schema({
  uid: { type: String, required: true },
  email: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  phone: { type: String }
  // automatically gets _id, which is a unique mongo id
});


userSchema.statics.register = function (userObj, cb) {
  if(!userObj.email || !userObj.password){
    return cb("Missing required field (email, password)");
  }
  ref.createUser(userObj, function(err, userData) {
    if(err) return cb(err);
    User.create({
      uid: userData.uid,
      email: userObj.email,
      firstname: userObj.firstname || '', 
      lastname: userObj.lastname || '',
      phone: userObj.phone || ''
    }, cb);
  });
};

userSchema.statics.login = function(userObj, cb) {
  if(!userObj.email || !userObj.password){
    return cb("Missing required field (email, password)");
  }
  ref.authWithPassword(userObj, function(err, authData) {
    if(err) return cb(err);
    User.findOne({uid: authData.uid}, function(err, user) {
      if(err || !user) return cb(err || 'User not found in db.');
      var token = user.generateToken();
      cb(null, user, token);
    });
  });
};

// userSchema.statics.forgot = function(input, cb) {
//   if(!input){
//     return cb("Missing email");
//   }
//   ref.resetPassword({
//     email: input.email
//   }, function(error) {
//     if (error) {
//       switch (error.code) {
//         case "INVALID_USER":
//           return cb("The specified user account does not exist.");
//           break;
//         default:
//           return cb("Error resetting password:", error);
//       }
//     } else {
//       return cb();
//     }
//   });
// }



// methods = instance method  oneuser.generateToken()
userSchema.methods.generateToken = function() {
  var payload = {
    uid: this.uid,
    _id: this._id, 
    email: this.email
  };
  var token = jwt.encode(payload, JWT_SECRET); 
  console.log("HERE'S THE TOKEN", token);
  return token;
}


// userSchema.statics.isLoggedIn = function(req, res, next) {
//   console.log('REQ.COOKIES', req.cookies);
//   var token = req.cookies.mytoken;
//   // if(!token) return authFail('no token');

//   // jwt.decode may fail, so we can wrap it in a try-catch block.
//   try {
//     var payload = jwt.decode(token, JWT_SECRET);  // risky code
//   } catch (err) { // if risky code fails, error will be caught here
    
//     console.log("THERE'S AN ERROR IN PAYLOAD");
//   }

//   req.user = payload;
//   next();
// };

User = mongoose.model('User', userSchema);

module.exports = User;