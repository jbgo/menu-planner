class MealsController < ApplicationController

  def index
    render json: Meal.for_week(Time.zone.now).as_json(include: [:menu_items])
  end

  def show
    render json: Meal.find(params[:id])
  end

  def create
    @meal = Meal.create! meal_params
    render json: @meal, status: :created
  end

  def update
    @meal = Meal.find params[:id]
    @meal.update_attributes! meal_params
    render json: @meal
  end

  def destroy
    Meal.find(params[:id]).destroy
    head :no_content
  end

  private

  def meal_params
    params.permit(:date, :meal_type)
  end

end
