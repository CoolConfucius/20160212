'use strict';

var app = angular.module('someApp', ['ui.router']); 

app.config(function($stateProvider, $urlRouterProvider) {
console.log("here?");
  $stateProvider
    .state('home', { url: '/', templateUrl: '/partials/home/home.html', controller: 'homeCtrl' })
    .state('register', { url: '/register', templateUrl: '/partials/register.html', controller: 'userCtrl' })
    .state('login', { url: '/login', templateUrl: '/partials/login.html', controller: 'userCtrl' })

  $urlRouterProvider.otherwise('/'); 
});

app.service('User', function($http) {
  if (!this.data) {
    this.data = {}; 
  };

  this.register = function(userObj) {
    return $http.post('/users/register', userObj)
  }

  this.login = function(userObj) {
    console.log("SERVICE LOGIN");
    return $http.post('/users/login', userObj).then(res => {
      console.log(res.data, 'DATA\n');
      this.data = res.data; 
    })
  }

})
app.controller('homeCtrl', function($scope, $state, User) {
  console.log('homeCtrl');
  $scope.user = User.data; 
  console.log($scope.user, "scope dot user");

});
app.controller('userCtrl', function($scope, $state, User) {
  console.log('userCtrl');
  $scope.user = User.data; 
  
  $scope.register = function() {
    var userObj = $scope.userObj;
    console.log($scope.userObj);
    User.register(userObj); 
    // location.href = '/#/login';
    $state.go('login');
  }

  $scope.login = function() {
    var userObj = $scope.userObj;
    console.log($scope.userObj);
    User.login(userObj); 
    // location.href = '/';
    $state.go('home');
  }

});