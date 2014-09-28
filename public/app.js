'use strict';

var app = angular.module('menuPlanner', [
  'ngRoute',
  'mpServices',
  'mpDirectives',
  'mpControllers'
])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
