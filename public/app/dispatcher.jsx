MP.Dispatcher = Backbone.View.extend({
  el: '#menu-plan',

  initialize: function() {
    // Backbone appears to be doing some funky shit that prevents _.bind and
    // _.bindAll from working correctly, so I created my own implementation to
    // enfore some sense of "this" sanity here.
    var _this = this;
    _.each(_.functions(this), function(funcName) {
      var func = _this[funcName];
      _this[funcName] = function() { return func.apply(_this, arguments); }
    });

    this.mealCards = new MP.MealCardCollection();
    this.mealCards.on('sync', this.render);
    this.mealCards.on('remove', this.render);
    this.mealCards.fetch();

    this.on('editMenuItem',   this.editMenuItem);
    this.on('deleteMenuItem', this.deleteMenuItem);

    this.on('addMealCard',    this.addMealCard);
    this.on('deleteMealCard', this.deleteMealCard);
    this.on('repeatMealCard', this.repeatMealCard);

    this.render();
  },

  render: function() {
    console.info('MP.Dispatcher#render', this);
    React.render(<MenuPlan mealCards={this.mealCards} />, this.el);
  },

  editMenuItem: function(mealCard, mealType, oldValue, newValue) {
    mealCard.editMenuItem(mealType, oldValue, newValue);
  },

  deleteMenuItem: function(mealCard, mealType, menuItem) {
    mealCard.deleteMenuItem(mealType, menuItem);
  },

  addMealCard: function(day, mealType) {
    this.mealCards.addMealCard(day, mealType);
  },

  deleteMealCard: function(mealCard, mealType) {
    mealCard.removeMealType(mealType);
  },

  repeatMealCard: function(day, mealType) {
  },

});

MP.dispatcher = new MP.Dispatcher();
MP.dispatch = MP.dispatcher.trigger;
