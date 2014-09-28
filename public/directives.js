angular.module('mpDirectives',[])

.directive('focusWhen', function() {
  return {
    link: function (scope, element, attrs) {
      scope.$watch('item.hasFocus', function(hasFocus) {
        if (hasFocus === true) {
          element[0].focus();
          element[0].select();
          scope[attrs.hasFocus] = false;
        }
      });
    }
  };
})

.directive('mealCard', function() {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: '/templates/meal-card.html'
  };
})
