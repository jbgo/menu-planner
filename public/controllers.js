angular.module('mpControllers',[])

.controller('WeekdayController', ['$scope', function($scope) {
  $scope.weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  var now = new Date(),
      dayOfWeek = now.getDay(); // 0 (sunday) ... 6 (saturday)

  $scope.startOfWeek = (new Date(now)).setDate(now.getDate() - dayOfWeek);
  $scope.endOfWeek = (new Date(now)).setDate(now.getDate() + (6 - dayOfWeek));
}])

.controller('MealCardsController', ['$scope', 'mealCardCollection', 'mealTypes',
  function($scope, mealCardCollection, mealTypes) {
    $scope.mealTypes = mealTypes.mealTypes;
    $scope.mealCards = mealCardCollection.mealCards;

    // delegate some mealCardCollection methods
    _.each(['createCard', 'removeCard', 'copyCard'], function(methodName) {
      var method = mealCardCollection[methodName];
      $scope[methodName] = function() { return method.apply(mealCardCollection, arguments); };
    });

    $scope.showCard = function(card, mealType) {
      return _.isArray(card.meals[mealType.name]);
    };
  }])

.controller('MenuItemsController', ['$scope', 'mealTypes',
  function($scope, mealTypes) {
    $scope.menuItems = function() {
      return $scope.card.meals[$scope.mealType.name];
    }

    $scope.enableEditing = function(item) {
      item.editable = item.hasFocus = true;
    };

    $scope.disableEditing = function(item, $event) {
      if (!$event || ($event && $event.keyCode === 13)) {
        item.editable = item.hasFocus = false;
        $scope.card.save();
      }
    };

    $scope.addItem = function($event) {
      var shouldAddNewItem = ($scope.newItem && $scope.newItem.trim() !== '' &&
        (!$event || ($event && event.keyCode === 13)));

      if (shouldAddNewItem) {
        $scope.menuItems().push({ name: $scope.newItem.trim() });
        $scope.newItem = null;
        $scope.card.save();
      }
    };

    $scope.removeItem = function(item) {
      var menuItems = $scope.menuItems();
      menuItems.splice(menuItems.indexOf(item), 1);
      $scope.card.save();
    };
  }])
