var MenuPlan = React.createClass({
  render: function() {
    return (
      <div id="menu">
        <MenuHeader />
        <MenuWorkspace meals={this.props.meals} />
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
        <MealCardList meals={this.props.meals}/>
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

    var meals = this.props.meals;
    var mealsByDay = this.props.meals.byDay();

    var mealTypeRows = MP.mealTypes.map(function(mealType) {
      return <MealTypeRow key={mealType.name} mealType={mealType} meals={meals} mealsByDay={mealsByDay} />;
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
    var mealType = this.props.mealType;

    var mealCardContainers = MP.weekdayNumbers.map(function(day) {
      var meals, meal;
      meals = _this.props.mealsByDay[day];
      if (meals) {
        meal = _.find(meals, function(m) { return m.get('meal_type') === mealType.enumValue });
      }
      return <MealCardContainer key={day} day={day} meals={_this.props.meals} mealType={mealType} meal={meal} />;
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
    this.props.meals.create({
      date: MP.getDateForDay(this.props.day),
      meal_type: this.props.mealType.enumValue
    });
  },

  render: function() {
    var mealCardContainer;

    
    if (this.props.meal) {
      mealCardContainer = (
        <MealCard meal={this.props.meal} />
      );
    } else {
      mealCardContainer = (
        <div className="add-meal-card">
          <ul><li>
            <a href="#" className="create-meal-card" onClick={this.addCard}>
              + New {this.props.mealType.name}
            </a>
          </li></ul>
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
  getInitialState: function() {
    return { wasEdited: false };
  },

  remove: function(e) {
    e.preventDefault();
    this.props.meal.destroy();
  },

  onChildEdit: function(child) {
    this.setState({ wasEdited: true });
  },

  render: function() {
    var _this = this;
    var meal = this.props.meal;

    var menuItems = meal.menuItems.map(function(menuItem) {
      return (
        <MenuItem key={menuItem.id} meal={meal} menuItem={menuItem} onEdit={_this.onChildEdit} />
      );
    });

    // add a blank item for appending to the list
    menuItems.push(
      <MenuItem key={uuid.v4()} meal={meal} onEdit={this.onChildEdit} focus={this.state.wasEdited} />
    );

    var styles = { backgroundColor: this.props.meal.getMealType().bgColor };

    return (
      <div className="meal-card">
        <div className="meal-card-header" title="Drag to move" style={styles}>
          <span className="meal-card-close" title="Remove" onClick={this.remove}>&times;</span>
          {meal.getMealType().name}
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
    if (e) { e.preventDefault(); }
    this.setState({ editable: true }, function() {
      $(this.getDOMNode()).find('input').focus().select();
    });
  },

  remove: function(e) {
    e.preventDefault();
    this.props.menuItem.destroy();
  },

  componentDidUpdate: function() {
    if (this.props.focus) {
      $(this.getDOMNode()).find('input').focus().select();
    }
  },

  handleEdit: function() {
    this.setState({ editable: false });
    this.props.onEdit(this);
  },

  render: function() {
    var menuItem = this.props.menuItem;
    var el;

    if (this.state.editable || !menuItem) {
      el = <EditableMenuItem meal={this.props.meal} menuItem={menuItem} onEdit={this.handleEdit} />;
    } else {
      el = (
        <li title="Edit">
          <div className="display">
            <span className="remove-item" title="Remove" onClick={this.remove}>&times;</span>
            <span onClick={this.makeEditable}>{menuItem.get('name')}</span>
          </div>
        </li>
      );
    }

    return el;
  }
});

var EditableMenuItem = React.createClass({
  handleKeyUp: function(e) {
    if (e.keyCode === 13) { // enter
      this.doneEditing();
    }
  },

  doneEditing: function(e) {
    var meal = this.props.meal;
    var menuItem = this.props.menuItem;
    var newValue = this.refs.menuItemName.getDOMNode().value;
    if (!menuItem && newValue.trim() === '') return; // Don't save new blank items

    if (menuItem) {
      menuItem.save({ name: newValue });
    } else if (newValue.trim() !== "") {
      meal.menuItems.create({ name: newValue });
    }

    this.props.onEdit(this);
  },

  componentDidMount: function() {
    $(this.getDOMNode()).find('input').focus();
  },

  render: function() {
    var menuItem = this.props.menuItem;

    return (
      <li className="editing">
        <input type="text" ref="menuItemName"
          defaultValue={menuItem ? menuItem.get('name') : null}
          placeholder="Add item..."
          onKeyUp={this.handleKeyUp}
          onBlur={this.doneEditing} />
      </li>
    );
  },
});
