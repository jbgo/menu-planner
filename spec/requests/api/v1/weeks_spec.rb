require 'rails_helper'

describe 'week requests' do
  describe '/api/v1/weeks/current' do
    before do
      Timecop.freeze(Time.zone.local(2014, 10, 4, 23, 59, 59))
      @start_of_week  = MealCard.create! date: Time.zone.local(2014, 9, 28)
      @middle_of_week = MealCard.create! date: Time.zone.local(2014, 10, 1, 12)
    end

    it 'returns this weeks meal cards' do
      json_get '/api/v1/weeks/current'
      expect(response.status).to eq(200)
      expect(parsed_response['meal_cards'].size).to eq(2)
    end
  end

end
