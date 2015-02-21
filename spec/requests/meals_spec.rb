require 'rails_helper'

describe 'meal requests' do

  describe 'POST /meals' do
    it 'creates a meal' do
      json_post '/meals', { date: '2014-10-04', meal_type: 'breakfast' }
      expect(response.status).to eq(201)

      meal = Meal.find(parsed_response['id'])
      expect(meal.date).to eq(Date.new(2014, 10, 4))
      expect(meal.meal_type).to eq('breakfast')
    end
  end

  describe 'PUT /meals/:id' do
    before do
      @meal = Meal.create!(date: Date.new(2014, 10, 4), meal_type: 'breakfast')
    end

    it 'updates a meal card' do
      json_put "/meals/#{@meal.id}", { id: @meal.id, date: '2014-10-05', meal_type: 'lunch' }
      expect(response.status).to eq(200)

      meal = Meal.find(parsed_response['id'])
      expect(meal).to eq(@meal.reload)
      expect(meal.date).to eq(Date.new(2014, 10, 5))
      expect(meal.meal_type).to eq('lunch')
    end
  end

  describe 'DELETE /meals/:id' do
    let(:meal) { Meal.create! }

    it 'deletes the meal card' do
      json_delete "/meals/#{meal.id}"
      expect(response.status).to eq(204)
      expect(Meal.find_by(id: meal.id)).to be_nil
    end
  end

end
