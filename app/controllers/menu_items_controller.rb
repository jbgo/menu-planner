class MenuItemsController < ApplicationController

  def index
    render json: meal.menu_items
  end

  def show
    render json: MenuItem.find(params[:id])
  end

  def create
    @menu_item = meal.menu_items.create! menu_item_params
    render json: @menu_item, status: :created
  end

  def update
    @menu_item = MenuItem.find params[:id]
    @menu_item.update_attributes! menu_item_params
    render json: @menu_item
  end

  def destroy
    MenuItem.find(params[:id]).destroy
    head :no_content
  end

  private

  def meal
    @meal ||= Meal.find params[:meal_id]
  end

  def menu_item_params
    params.permit(:name)
  end

end
