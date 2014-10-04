require 'rails_helper'

describe MealCard do

  describe '.this_week' do
    before { Time.zone = 'Pacific Time (US & Canada)' }

    def create_meal_cards
      @week_before    = MealCard.create! date: Time.zone.local(2014, 9, 27, 23, 59, 59)
      @week_after     = MealCard.create! date: Time.zone.local(2014, 10, 5)
      @end_of_week    = MealCard.create! date: Time.zone.local(2014, 10, 4, 23, 59, 59)
      @start_of_week  = MealCard.create! date: Time.zone.local(2014, 9, 28)
      @middle_of_week = MealCard.create! date: Time.zone.local(2014, 10, 1, 12)
    end

    context 'when it is the beiginning of the week' do
      before do
        Timecop.freeze(Time.zone.local(2014, 9, 28))
        create_meal_cards
      end

      it 'find all the cards for the week' do
        expect(MealCard.this_week).to eq([@start_of_week, @middle_of_week, @end_of_week])
      end
    end

    context 'when it is the end of the week' do
      before do
        Timecop.freeze(Time.zone.local(2014, 10, 4, 23, 59, 59))
        create_meal_cards
      end

      it 'find all the cards for the week' do
        expect(MealCard.this_week).to eq([@start_of_week, @middle_of_week, @end_of_week])
      end
    end

  end

end
