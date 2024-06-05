from django.urls import path, include
from django.views.generic import TemplateView
from . import views
from .views import classement, send_otp_email 

from .views import RegisterView, MyTokenObtainPairView, SetupTOTPView, VerifyTOTPView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import classement, send_otp_email, verify_otp

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'messages', views.MessageViewSet)
router.register(r'blocked_users', views.BlockedUserViewSet)

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    path('chat/getMessages/<str:room>/', views.getMessages, name='getMessages'),
    # path('', views.home, name='home'),  # Ensure this is routing the root URL to your home view
    path('chat/<str:room>/', views.room, name="room"),
    path('chat/checkview', views.checkview, name="checkview"),
    path('chat/send', views.send, name="send"),
    path('chat/', TemplateView.as_view(template_name='chat.html')),
    path('register/', views.register_user, name='register_user'),
    path('login/', views.login_user, name='login_user'),
    path('logout/', views.logout_view, name='logout_view'),
    path('check_user_logged_in/', views.check_user_logged_in, name='check_user_logged_in'),
    path('login42/', views.login_42, name='login_42'),
    path('update_user_info/', views.update_user_info, name='update_user_info'),
    path('upload_avatar/', views.upload_avatar, name='upload_avatar'),
    path('classement/', classement, name='classement'),
    path('send_friend_request/<str:username>/', views.send_friend_request, name='send_friend_request'),
    path('accept_friend_request/<int:request_id>/', views.accept_friend_request, name='accept_friend_request'),
    path('decline_friend_request/<int:request_id>/', views.decline_friend_request, name='decline_friend_request'),
    path('friend_requests/', views.list_friend_requests, name='list_friend_requests'),
    path('pending_friend_requests/', views.pending_friend_requests, name='pending_friend_requests'),
    path('list_friends_with_status/', views.list_friends_with_status, name='list_friends_with_status'),
    path('update_online_status/', views.update_online_status, name='update_online_status'),
    path('user_logged_out_callback', views.user_logged_out_callback, name='user_logged_out_callback'),
    path('user_logged_in_callback', views.user_logged_in_callback, name='user_logged_in_callback'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('2fa/setup/', SetupTOTPView.as_view(), name='setup_totp'),
    path('2fa/verify/', VerifyTOTPView.as_view(), name='verify_totp'),
	path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
	path('send_otp_email/', send_otp_email, name='send_otp_email'),
	path('verify_otp/', views.verify_otp, name='verify_otp'),
    path('setup_totp/', SetupTOTPView.as_view(), name='setup_totp'),
    path('verify_otp/', VerifyTOTPView.as_view(), name='verify_otp'),
	path('verify_otp/', verify_otp, name='verify_otp'),
    path('api/2fa/setup/', SetupTOTPView.as_view(), name='setup_totp'),
    path('api/2fa/verify/', VerifyTOTPView.as_view(), name='verify_totp'),
    path('save_game_history/', views.save_game_history, name='save_game_history'),
    path('get_game_history/', views.get_game_history, name='get_game_history'),
    path('api/', include(router.urls)),  # Ensure this is placed after other patterns to avoid conflicts
]