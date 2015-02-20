var MenuPlan = React.createClass({
  render: function() {
    return (
      <div id="menu">
        <MenuHeader />
        <MenuWorkspace mealCards={this.props.mealCards} />
      </div>
    );
  }
});

var MenuHeader = React.createClass({
  render: function() {
    var startDay = MP.startOfWeek();
    var endDay = MP.endOfWeek();

    return (
      <div className="mp-header">
        <h1 className="brand"><a href="/">MP</a></h1>
        <div className="week-summary">
          <h2>Week of {startDay} - {endDay}</h2>
        </div>
      </div>
    );
  }
});

var MenuWorkspace = React.createClass({
  render: function() {
    return (
      <div className="workspace">
        <Timeline />
        <MealCardList mealCards={this.props.mealCards}/>
      </div>
    );
  }
});

var Timeline = React.createClass({
  render: function() {
    var weekdays = MP.weekdays.map(function(day) {
      return <li key={day} className="day-col">{day}</li>;
    });

    return (
      <div className="timeline">
        <ul>{weekdays}</ul>
      </div>
    );
  }
});

var MealCardList = React.createClass({
  render: function() {
    var _this = this;

    var mealCardsByDay = this.props.mealCards.byDay();

    var mealTypeRows = MP.mealTypes.map(function(mealType) {
      return <MealTypeRow key={mealType.name} mealType={mealType} mealCardsByDay={mealCardsByDay} />;
    });

    return (
      <div className="meal-cards">
        {mealTypeRows}
      </div>
    );
  }
});

var MealTypeRow = React.createClass({
  render: function() {
    var _this = this;
    var mealCardContainers = MP.weekdayNumbers.map(function(day) {
      return <MealCardContainer key={day} day={day} mealType={_this.props.mealType} mealCard={_this.props.mealCardsByDay[day]} />;
    });

    return (
      <div className="meal-type-row">
        {mealCardContainers}
      </div>
    );
  }
});

var MealCardContainer = React.createClass({
  addCard: function(e) {
    e.preventDefault();
    MP.dispatch('addMealCard', this.props.day, this.props.mealType);
  },

  render: function() {
    var mealCardContainer;
    var meals;
    
    if (this.props.mealCard) {
      meals = this.props.mealCard.get('meals')[this.props.mealType.name];
    }

    if (meals) {
      mealCardContainer = (
        <MealCard mealType={this.props.mealType} mealCard={this.props.mealCard} meals={meals} />
      );
    } else {
      mealCardContainer = (
        <div className="add-meal-card">
          <ul>
            <li><a href="#" className="create-meal-card" onClick={this.addCard}>+ New {this.props.mealType.name}</a></li>
            <li><a href="#" className="copy-meal-card">+ Repeat {this.props.mealType.name}</a></li>
          </ul>
        </div>
      );
    }

    return (
      <div className="day-col">
        {mealCardContainer}
      </div>
    );
  }
});

var MealCard = React.createClass({
  removeCard: function(e) {
    e.preventDefault();
    MP.dispatch('deleteMealCard', this.props.mealCard, this.props.mealType);
  },

  render: function() {
    var _this = this;

    var menuItems = this.props.meals.map(function(meal) {
      return <MenuItem key={meal.name} mealType={_this.props.mealType} mealCard={_this.props.mealCard} meal={meal} />;
    });

    // add a blank item for appending to the list
    menuItems.push(
      <MenuItem key={uuid.v4()} mealType={this.props.mealType} mealCard={this.props.mealCard} />
    );

    return (
      <div className="meal-card">
        <div className="meal-card-header" title="Drag to move" style={{ bgColor: this.props.mealType.bgColor }}>
          <span className="meal-card-close" title="Remove" onClick={this.removeCard}>&times;</span>
          {this.props.mealType.name}
        </div>

        <ul>{menuItems}</ul>
      </div>
    );
  }
});

var MenuItem = React.createClass({
  getInitialState: function() {
    return { editable: false };
  },

  makeEditable: function(e) {
    e.preventDefault();
    this.setState({ editable: true }, function() {
      $(this.getDOMNode()).find('input').focus().select();
    });
  },

  handleKeyUp: function(e) {
    if (e.keyCode === 13) { // enter
      this.doneEditing();
    }
  },

  doneEditing: function(e) {
    var _this = this;
    var oldValue = (this.props.meal && this.props.meal.name);
    var newValue = this.refs.menuItemName.getDOMNode().value;
    MP.dispatch('editMenuItem', this.props.mealCard, this.props.mealType, oldValue, newValue);
    this.setState({ editable: false });
  },

  render: function() {
    var meal = this.props.meal;
    var isNew = !meal;
    var menuItem;

    if (this.state.editable || isNew) {
      menuItem = (
        <li className="editing">
          <input type="text" ref="menuItemName"
            defaultValue={isNew ? null : meal.name}
            placeholder="Add item..."
            onKeyUp={this.handleKeyUp}
            onBlur={this.doneEditing} />
        </li>
      );
    } else {
      menuItem = (
        <li title="Edit" onClick={this.makeEditable}>
          <div className="display">
            <span className="remove-item" title="Remove">&times;</span>
            {meal.name}
          </div>
        </li>
      );
    }

    return menuItem;
  }
});
