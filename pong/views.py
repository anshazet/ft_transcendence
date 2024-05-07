from http.client import HTTPResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from .forms import LoginForm


@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Ce nom d\'utilisateur est déjà pris'}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Cet email est déjà pris'}, status=400)
        user = User.objects.create_user(username=username, email=email, password=password)
        return JsonResponse({'success': 'Utilisateur enregistré avec succès!'})
    else:
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
    

from django.http import JsonResponse

def login_user(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'error_message': 'Nom d\'utilisateur ou mot de passe incorrect.'})
        else:
            return JsonResponse({'success': False, 'error_message': 'Formulaire invalide.'})
    else:
        return JsonResponse({'success': False, 'error_message': 'Méthode de requête non autorisée.'})
