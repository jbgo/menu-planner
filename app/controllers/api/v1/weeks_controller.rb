class Api::V1::WeeksController < ApplicationController
  respond_to :json

  def show
    respond_with meal_cards: MealCard.this_week
  end

end
