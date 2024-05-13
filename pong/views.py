from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from .forms import LoginForm
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required


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

def logout_view(request):
    if request.user.is_authenticated:
        logout(request)
    return redirect('login_user')

@login_required
def check_user_logged_in(request):
    return JsonResponse({'logged_in': True})

import json
import urllib.parse
import urllib.request
from django.shortcuts import redirect
from django.contrib.auth.models import User
from django.http import JsonResponse

CLIENT_ID = 'u-s4t2ud-69c7a5257ffb84374c9f2c6a08736a4f080650b67ed9308ad6b3f31fb7cd6ce5'
CLIENT_SECRET = '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'
REDIRECT_URI = 'http://localhost:8000/login42/'

def login_42(request):
    code = request.GET.get('code')
    if code:
        token_data = {
            'grant_type': 'authorization_code',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'code': code,
            'redirect_uri': REDIRECT_URI
        }
        token_data_encoded = urllib.parse.urlencode(token_data).encode('utf-8')
        req = urllib.request.Request('https://api.intra.42.fr/oauth/token', data=token_data_encoded)
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                token_response = json.loads(response.read().decode('utf-8'))
                access_token = token_response.get('access_token')
                user_req = urllib.request.Request('https://api.intra.42.fr/v2/me')
                user_req.add_header('Authorization', f'Bearer {access_token}')
                with urllib.request.urlopen(user_req) as user_response:
                    if user_response.status == 200:
                        user_data = json.loads(user_response.read().decode('utf-8'))
                        username = user_data['login']
                        email = user_data['email']
                        # Vérifier si l'utilisateur existe déjà
                        if User.objects.filter(username=username).exists():
                            # Connectez l'utilisateur existant
                            user = User.objects.get(username=username)
                            user.backend = 'django.contrib.auth.backends.ModelBackend'
                            login(request, user)
                            return redirect('http://localhost:8000')
                        else:
                            # Créer un nouvel utilisateur
                            User.objects.create_user(username=username, email=email)
                            login(request, user)
                            return redirect('http://localhost:8000')
                    else:
                        return JsonResponse({'error': 'Impossible de récupérer les informations de l\'utilisateur 42'}, status=500)
            else:
                return JsonResponse({'error': 'Impossible de récupérer le jeton d\'accès'}, status=500)
    else:
        return JsonResponse({'error': 'Code non fourni'}, status=400)