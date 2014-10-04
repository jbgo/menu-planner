class MealCard < ActiveRecord::Base

  class << self
    def this_week
      today = Time.zone.now.to_date
      day_of_week = today.cwday % 7 # in ruby 7 is Sunday, but we want 0 to be Sunday
      start_of_week = today - day_of_week
      end_of_week = today + (7 - day_of_week)

      where('date >= :start_of_week and date < :end_of_week',
        start_of_week: start_of_week,
        end_of_week: end_of_week)
      .order(:date)
    end
  end

end
