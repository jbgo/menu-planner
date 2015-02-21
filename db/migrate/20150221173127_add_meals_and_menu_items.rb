class AddMealsAndMenuItems < ActiveRecord::Migration
  def change
    drop_table :meal_cards

    create_table :meals do |t|
      t.date :date
      t.integer :meal_type
      t.timestamps
    end

    create_table :menu_items do |t|
      t.integer :meal_id
      t.string :name
      t.timestamps
    end

    add_foreign_key :menu_items, :meals
  end
end
