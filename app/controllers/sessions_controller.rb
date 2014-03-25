class SessionsController < ApplicationController
  before_action :ensure_signed_in, only: [:destroy]

  def new
    @user = User.new
    render :new, locals: {user: @user}
  end

  def create
    @user = User.find_by_credentials(session_params[:username], session_params[:password])
    if @user
      login!(@user)
      redirect_to "/"
    else
      @user = User.new(session_params)
      flash.now[:errors] = "No user found for these credentials."
      render :new, locals: {user: @user}
    end
  end

  def destroy
    logout!
    redirect_to "/"
  end

  private
  def session_params
    params.require(:user).permit(:username, :password)
  end
end
