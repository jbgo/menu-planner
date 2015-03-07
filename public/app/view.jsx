MP.MenuView = Backbone.View.extend({
  el: '#menu-plan',

  initialize: function() {
    this.meals = new MP.MealCollection();
    this.meals.on('sync', this.render, this);
    this.meals.on('change', this.render, this);
    this.meals.on('remove', this.render, this);
    this.meals.fetch();
    this.render();
  },

  render: function() {
    var root = React.createElement(MenuPlan, { meals: this.meals });
    React.render(root, this.el);
  }
});

MP.view = new MP.MenuView();
