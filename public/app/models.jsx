window.MP = {};

MP.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
MP.weekdayNumbers = [0, 1, 2, 3, 4, 5, 6];

MP.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

MP.mealTypes = [
  { name: 'Breakfast', bgColor: '2653B6' },
  { name: 'Lunch', bgColor: '0FAC92' },
  { name: 'Dinner', bgColor: 'B9750E' }
];


MP.formatDate = function(date) {
  return MP.months[date.getMonth()] + ' ' + date.getDate();
};

MP.startOfWeek = function() {
  var now = new Date();
  now.setDate(now.getDate() - now.getDay());
  return this.formatDate(now);
};

MP.endOfWeek = function() {
  var now = new Date();
  now.setDate(now.getDate() + (6 - now.getDay()));
  return this.formatDate(now);
};

MP.getDateForDay = function(day) {
  var date, month, dayOfMonth;

  date = new Date();
  date.setDate(date.getDate() + (day - date.getDay()));
  month = date.getMonth() + 1;
  dayOfMonth = date.getDate();

  return [
    date.getFullYear(),
    (month < 10 ? "0" + month : month),
    (dayOfMonth < 10 ? "0" + dayOfMonth : dayOfMonth)
  ].join('-');
};

MP.MealCard = Backbone.Model.extend({
  urlRoot: '/api/v1/meal_cards',

  parse: function(response, options) {
    var d = new Date(response.date);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());

    return _.extend(response, {
      day: d.getDay()
    });
  },

  getMenuItemsForMealType: function(mealType) {
    return this.get('meals')[mealType.name];
  },

  removeMealType: function(mealType) {
    var meals = this.get('meals');
    delete meals[mealType.name];
    if (_.isEmpty(meals)) {
      this.destroy();
    } else {
      this.save();
    }
  },

  editMenuItem: function(mealType, oldValue, newValue) {
    var menuItems = this.getMenuItemsForMealType(mealType);
    var item = _.find(menuItems, function(item) {
      return item.name === oldValue;
    });

    if (item) {
      item.name = newValue;
    } else {
      menuItems.push({ name: newValue });
    }

    this.save();
  },

  deleteMenuItem: function(mealType, menuItem) {
    var menuItems = this.getMenuItemsForMealType(mealType);
    var index = _.findIndex(menuItems, function(item) {
      return item.name === menuItem.name;
    });
    menuItems.splice(index, 1);
    this.save();
  }
});

MP.MealCardCollection = Backbone.Collection.extend({
  url: '/api/v1/meal_cards',
  model: MP.MealCard,

  byDay: function() {
    var mealCardsByDay = this.map(function(mealCard) {
      return [mealCard.get('day'), mealCard];
    });

    return _.object(_.compact(mealCardsByDay));
  },

  addMealCard: function(day, mealType) {
    var mealCard = this.findWhere({ day: day });
    var meals;

    if (mealCard) {
      meals = mealCard.get('meals');
      meals[mealType.name] = meals[mealType.name] || [];
      mealCard.save({ meals: meals });
    } else {
      meals = {};
      meals[mealType.name] = [];
      this.create({ date: MP.getDateForDay(day), meals: meals });
    }
  }
});
