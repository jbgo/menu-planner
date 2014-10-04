'use strict';

var app = angular.module('menuPlanner', [
  'ngRoute',
  'restangular',
  'mpServices',
  'mpDirectives',
  'mpControllers'
])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
