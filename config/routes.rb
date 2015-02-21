Rails.application.routes.draw do

  resources :meals do
    resources :menu_items
  end

end
