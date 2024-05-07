from django import forms
from django.http import JsonResponse
from django.contrib.auth import authenticate, login


class LoginForm(forms.Form):
    username = forms.CharField(label='Nom d\'utilisateur')
    password = forms.CharField(label='Mot de passe', widget=forms.PasswordInput)
