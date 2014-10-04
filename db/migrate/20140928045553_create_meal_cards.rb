class CreateMealCards < ActiveRecord::Migration
  def change
    create_table :meal_cards do |t|
      t.date :date
      t.json :meals
      t.timestamps
    end
  end
end
