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

.factory('mealCardCollection', function() {
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

  return new MealCardCollection;
})
