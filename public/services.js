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

.factory('MP_REST',  ['Restangular', function(Restangular) {
  return Restangular.withConfig(function(config) {
    config.setBaseUrl('http://localhost:3000/api/v1');
    config.setDefaultHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  });
}])

.factory('MPWeeks', ['MP_REST', function(MP_REST) {
  return MP_REST.all('weeks');
}])

.factory('MPMealCards', ['MP_REST', function(MP_REST) {
  return MP_REST.all('meal_cards');
}])

.factory('mealCardCollection', ['MP_REST', 'MPWeeks', 'MPMealCards', function(MP_REST, MPWeeks, MPMealCards) {
  var MealCard = function(day, meals) {
    this.day = day;
    this.meals = meals || {};

    function dateFromDay(day) {
      var date = new Date, month, d;
      date.setDate(date.getDate() + (day - date.getDay()));
      month = date.getMonth() + 1;
      d = date.getDate();

      return [
        date.getFullYear(),
        (month < 10 ? "0"+month : month),
        (d < 10 ? "0"+d : d)
      ].join('-');
    };

    this.date = dateFromDay(day);

    var model = this;

    this.save = function() {
      var payload = { meal_card: { date: this.date, meals: this.meals } };
      if (this.id) {
        payload.id = this.id;
        MP_REST.one('meal_cards', this.id).customPUT(payload);
      } else {
        MPMealCards.customPOST(payload).then(function(response) {
          model.id = response.meal_card.id;
        });
      }
    };

    this.destroy = function() {
      return MP_REST.one('meal_cards', this.id).remove();
    }
  };

  var MealCardCollection = function() { };
  var proto = MealCardCollection.prototype;

  proto.mealCards = _.map(_.range(0, 6), function(day) {
    return new MealCard(day);
  });

  proto.createCard = function(nullCard, mealType) {
    nullCard.meals[mealType.name] = [];
    nullCard.save();
  };

  proto.copyCard = function(card, mealType) {
    var prevCard = this.previousCard(card, mealType);
    card.meals[mealType.name] = _.cloneDeep(prevCard.meals[mealType.name])
    card.id = null;
    card.save();
  };

  proto.removeCard = function(card, mealType) {
    card.destroy().then(function() {
      delete card.meals[mealType.name];
    });
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
      c.id = mc.id;
      c.meals = mc.meals;
    });
  });

  return collection;
}])
