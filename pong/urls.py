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
]
