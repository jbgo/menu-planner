class Meal < ActiveRecord::Base
  enum meal_type: [:breakfast, :lunch, :dinner]
  has_many :menu_items, dependent: :delete_all

  scope :for_week, ->(date_in_week=nil) {
    date_in_week = (date_in_week || Time.zone.now).to_date
    day_of_week = date_in_week.cwday % 7 # in ruby 7 is Sunday, but we want 0 to be Sunday
    start_of_week = date_in_week - day_of_week
    end_of_week = date_in_week + (7 - day_of_week)

    where('date >= :start_of_week and date < :end_of_week',
      start_of_week: start_of_week,
      end_of_week: end_of_week)
    .order(:date)
  }

end
