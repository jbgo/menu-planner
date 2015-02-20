class Api::V1::MealCardsController < ApplicationController
  respond_to :json

  def index
    respond_with MealCard.this_week
  end

  def create
    @meal_card = MealCard.create! meal_card_params
    respond_to do |format|
      format.json { render json: @meal_card, status: :created }
    end
  end

  def update
    @meal_card = MealCard.find params[:id].to_i
    @meal_card.update_attributes! meal_card_params
    respond_to do |format|
      format.json { render json: @meal_card }
    end
  end

  def destroy
    MealCard.find(params[:id].to_i).destroy
    head :no_content
  end

  private

  def meal_card_params
    params[:meal_card].slice(:date, :meals).to_hash
  end

end
