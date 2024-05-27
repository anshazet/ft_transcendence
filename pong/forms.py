from django import forms
from django.http import JsonResponse
from django.contrib.auth import authenticate, login


class LoginForm(forms.Form):
    username = forms.CharField(label='Nom d\'utilisateur')
    password = forms.CharField(label='Mot de passe', widget=forms.PasswordInput)

class OTPForm(forms.Form):
    otp_token = forms.CharField(label='OTP Token')

from django import forms
from django.contrib.auth.models import User
from .models import CustomUser

class SendFriendRequestForm(forms.Form):
    to_user = forms.ModelChoiceField(queryset=CustomUser.objects.all())

class AcceptFriendRequestForm(forms.Form):
    request_id = forms.IntegerField()

class DeclineFriendRequestForm(forms.Form):
    request_id = forms.IntegerField()