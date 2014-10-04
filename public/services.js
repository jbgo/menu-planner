angular.module('mpServices',[])

.factory('mealTypes', function() {
  return {
    mealTypes: [
      { name: 'Breakfast', bgColor: '2653B6' },
      { name: 'Lunch', bgColor: '0FAC92' },
      { name: 'Dinner', bgColor: 'B9750E' }
    ]
  };
})

.factory('MPWeeks', ['Restangular', function(Restangular) {
  return Restangular.withConfig(function(config) {
    config.setBaseUrl('http://localhost:3000/api/v1');
    config.setDefaultHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }).all('weeks');
}])

.factory('mealCardCollection', ['MPWeeks', function(MPWeeks) {
  var MealCard = function(day, meals) {
    this.day = day;
    this.meals = meals || {};
  };

  var MealCardCollection = function() { };
  var proto = MealCardCollection.prototype;

  proto.mealCards = _.map(_.range(0, 6), function(day) {
    return new MealCard(day);
  });

  proto.createCard = function(nullCard, mealType) {
    nullCard.meals[mealType.name] = [];
  };

  proto.copyCard = function(card, mealType) {
    var prevCard = this.previousCard(card, mealType);
    card.meals[mealType.name] = _.cloneDeep(prevCard.meals[mealType.name])
  };

  proto.removeCard = function(card, mealType) {
    delete card.meals[mealType.name];
  };

  proto.previousCard = function(todaysCard, mealType) {
    var index = todaysCard.day - 1,
        prevCard = this.mealCards[index];

    if (index > 0 && !_.isArray(prevCard.meals[mealType.name])) {
      return this.previousCard(prevCard, mealType);
    } else {
      return prevCard;
    }
  };

  var collection = new MealCardCollection;

  MPWeeks.get('current').then(function(data) {
    _.each(data.meal_cards, function(mc) {
      var d = new Date(mc.date);
      d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
      mc.day = d.getDay();
      var c = _.find(collection.mealCards, function(card) { return card.day == mc.day; });
      c.meals = mc.meals;
    });
  });

  return collection;
}])
