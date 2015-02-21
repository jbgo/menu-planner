window.MP = {};

MP.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
MP.weekdayNumbers = [0, 1, 2, 3, 4, 5, 6];

MP.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

MP.mealTypes = [
  { name: 'Breakfast', enumValue: 'breakfast', bgColor: '#2653B6' },
  { name: 'Lunch',     enumValue: 'lunch',     bgColor: '#0FAC92' },
  { name: 'Dinner',    enumValue: 'dinner',    bgColor: '#B9750E' }
];

MP.mealTypeLookup = _.object(_.map(MP.mealTypes, function(t) {
  return [t.enumValue, t];
}));


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

MP.Meal = Backbone.Model.extend({
  urlRoot: '/meals',

  initialize: function() {
    this.on('change:id', this.setMenuItemUrl);
  },

  setMenuItems: function(models) {
    this.menuItems = new MP.MenuItemCollection();
    this.menuItems.reset(models || []);
    this.listenTo(this.menuItems, 'remove', function() { this.trigger('change', this); });
  },

  setMenuItemUrl: function(model, id) {
    if (this.menuItems) {
      this.menuItems.url = '/meals/' + id + '/menu_items';
    }
  },

  getMealType: function() {
    return MP.mealTypeLookup[this.get('meal_type')];
  },

  parse: function(response, options) {
    var d = new Date(response.date);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    this.setMenuItems(response.menu_items);
    this.setMenuItemUrl(null, response.id);
    return _.extend(response, { day: d.getDay() });
  }
});

MP.MealCollection = Backbone.Collection.extend({
  url: '/meals',
  model: MP.Meal,

  byDay: function() {
    var mealsByDay = {};
    var day;

    this.each(function(meal) {
      day = meal.get('day');
      if (!mealsByDay[day]) { mealsByDay[day] = []; }
      mealsByDay[day].push(meal);
    });

    return mealsByDay;
  }
});

MP.MenuItem = Backbone.Model.extend({
});

MP.MenuItemCollection = Backbone.Collection.extend({
  model: MP.MenuItem
});
