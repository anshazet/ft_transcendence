"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from django.views.generic import TemplateView
from . import views
from .views import classement

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
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
    path('list_friends_with_status/', views.list_friends_with_status, name='list_friend_requests'),
    path('update_online_status/', views.update_online_status, name='update_online_status'),
]
