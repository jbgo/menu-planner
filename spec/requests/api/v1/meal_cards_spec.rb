require 'rails_helper'

describe '/api/v1/meal_cards' do

  describe 'POST /api/v1/meal_cards' do
    it 'creates a meal card' do
      json_post '/api/v1/meal_cards', meal_card: {
        date: '2014-10-04',
        meals: { Breakfast: [] }
      }

      expect(response.status).to eq(201)

      meal_card = MealCard.find(parsed_response['meal_card']['id'])
      expect(meal_card.date).to eq(Date.new(2014, 10, 4))
      expect(meal_card.meals['Breakfast']).to eq([])
    end
  end

  describe 'PUT /api/v1/meal_cards/:id' do
    before do
      @meal_card = MealCard.create!(
        date: Date.new(2014, 10, 4),
        meals: { Breakfast: [] })
    end

    it 'updates a meal card' do
      json_put "/api/v1/meal_cards/#{@meal_card.id}", meal_card: {
        id: @meal_card.id,
        date: '2014-10-04',
        day: 6,
        meals: { Breakfast: [{ name: 'milk' }, { name: 'eggs' }] }
      }

      expect(response.status).to eq(200)

      meal_card = MealCard.find(parsed_response['meal_card']['id'])
      expect(meal_card).to eq(@meal_card.reload)
      expect(meal_card.meals['Breakfast'].map { |m| m['name'] }).to eq(['milk', 'eggs'])
    end
  end

  describe 'DELETE /api/v1/meal_cards/:id' do
    let(:meal_card) { MealCard.create! }

    it 'deletes the meal card' do
      json_delete "/api/v1/meal_cards/#{meal_card.id}"
      expect(response.status).to eq(204)
      expect(MealCard.find_by(id: meal_card.id)).to be_nil
    end
  end

end
