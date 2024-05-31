#  views copy

from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout

from .forms import LoginForm
from django.shortcuts import redirect, render, get_object_or_404
from django.contrib.auth.decorators import login_required
import os
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp.plugins.otp_email.models import EmailDevice
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer 
from .forms import OTPForm
from django.core.mail import send_mail
import random
import logging


@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        if CustomUser.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Ce nom d\'utilisateur est déjà pris'}, status=400)
        if CustomUser.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Cet email est déjà pris'}, status=400)
        user = CustomUser.objects.create_user(username=username, email=email, password=password)
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
import requests
from django.shortcuts import redirect
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.http import HttpResponseBadRequest,  HttpResponse

CLIENT_ID = 'u-s4t2ud-69c7a5257ffb84374c9f2c6a08736a4f080650b67ed9308ad6b3f31fb7cd6ce5'
CLIENT_SECRET = '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'
REDIRECT_URI = 'http://localhost:8000/login42/'

@csrf_exempt
def login_42(request):
    code = request.GET.get('code')
    print("Code reçu :", code)
    if code:
        token_data = {
            'grant_type': 'authorization_code',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'code': code,
            'redirect_uri': REDIRECT_URI
        }
        token_response = requests.post('https://api.intra.42.fr/oauth/token', data=token_data)
        if token_response.status_code == 200:
            token_response_data = token_response.json()
            access_token = token_response_data.get('access_token')
            user_response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'})
            if user_response.status_code == 200:
                user_data = user_response.json()
                username = user_data['login']
                email = user_data['email']
                if CustomUser.objects.filter(username=username).exists():
                    user = CustomUser.objects.get(username=username)
                    user.backend = 'django.contrib.auth.backends.ModelBackend'
                    login(request, user)
                    return redirect('http://localhost:8000')
                else:
                    CustomUser.objects.create_user(username=username, email=email)
                    user = CustomUser.objects.get(username=username)
                    login(request, user)
                    return redirect('http://localhost:8000')
            else:
                return JsonResponse({'error': 'Impossible de récupérer les informations de l\'utilisateur 42'}, status=500)
        else:
            return JsonResponse({'error': 'Impossible de récupérer le jeton d\'accès'}, status=500)
    else:
        return JsonResponse({'error': 'Code non fourni'}, status=400)

    

@login_required
def profile_view(request):
    user = request.user
    form = OTPForm()  # Instantiate the form
    print("User:", user)  # Debugging output
    print("Form:", form)  # Debugging output
    
    context = {
        'user': user,
        'form': form,  # Add the form to the context
    }
    
    return render(request, 'index.html', context)  # Render the template with the context

@login_required
def update_user_info(request):
    if request.method == 'POST':
        user = request.user
        old_username = user.username
        new_username = request.POST.get('username', old_username)
        
        if new_username and new_username != old_username:
            user.username = new_username
            rename_avatar_file(old_username, new_username)
        if 'email' in request.POST and request.POST['email']:
            user.email = request.POST['email']
        if 'password' in request.POST and request.POST['password']:
            user.set_password(request.POST['password'])
        user.save()

        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

def rename_avatar_file(old_username, new_username):
    chemin_static_avatar = os.path.join(settings.BASE_DIR, 'static', 'avatar')
    old_avatar_path = os.path.join(chemin_static_avatar, f'{old_username}-avatar.png')
    new_avatar_path = os.path.join(chemin_static_avatar, f'{new_username}-avatar.png')

    if os.path.exists(old_avatar_path):
        os.rename(old_avatar_path, new_avatar_path)
        print(f"Fichier {old_avatar_path} renommé en {new_avatar_path}")

import shutil
def deplacer_images():
    chemin_media = '/code/media/avatar'
    chemin_static_avatar = '/code/static/avatar'

    fichiers = os.listdir(chemin_media)

    for fichier in fichiers:
        chemin_complet_source = os.path.join(chemin_media, fichier)
        chemin_complet_destination = os.path.join(chemin_static_avatar, fichier)
        shutil.move(chemin_complet_source, chemin_complet_destination)
        print(f"Fichier {fichier} déplacé avec succès vers {chemin_static_avatar}")


def upload_avatar(request):
    if request.method == 'POST' and request.FILES.get('avatar'):
        avatar = request.FILES['avatar']
        username = request.user.username
        avatar_path = os.path.join(settings.MEDIA_ROOT, 'avatar', f'{username}-avatar.png')
        with open(avatar_path, 'wb') as f:
            for chunk in avatar.chunks():
                f.write(chunk)
        deplacer_images()
        return JsonResponse({'message': 'Avatar uploaded successfully.'})
    else:
        return JsonResponse({'error': 'No avatar uploaded.'}, status=400)
    
def classement(request):
    players = CustomUser.objects.all().values('username', 'email')
    return JsonResponse(list(players), safe=False)

from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from .forms import SendFriendRequestForm, AcceptFriendRequestForm, DeclineFriendRequestForm
from .models import FriendRequest, CustomUser

@login_required
def send_friend_request(request):
    if request.method == 'POST':
        form = SendFriendRequestForm(request.POST)
        if form.is_valid():
            to_user = form.cleaned_data['to_user']
            friend_request, created = FriendRequest.objects.get_or_create(from_user=request.user, to_user=to_user)
            if created:
                return redirect('friend_request_sent')  # Remplace par le nom de ta vue de confirmation
    else:
        form = SendFriendRequestForm()
    return render(request, 'send_friend_request.html', {'form': form})

@login_required
def accept_friend_request(request):
    if request.method == 'POST':
        form = AcceptFriendRequestForm(request.POST)
        if form.is_valid():
            request_id = form.cleaned_data['request_id']
            friend_request = get_object_or_404(FriendRequest, id=request_id)
            if friend_request.to_user == request.user:
                # Logique pour créer la relation d'amitié, par exemple en utilisant un ManyToManyField sur User
                friend_request.delete()
                return redirect('friend_request_accepted')  # Remplace par le nom de ta vue de confirmation
    else:
        form = AcceptFriendRequestForm()
    return render(request, 'accept_friend_request.html', {'form': form})

@login_required
def decline_friend_request(request):
    if request.method == 'POST':
        form = DeclineFriendRequestForm(request.POST)
        if form.is_valid():
            request_id = form.cleaned_data['request_id']
            friend_request = get_object_or_404(FriendRequest, id=request_id)
            if friend_request.to_user == request.user:
                friend_request.delete()
                return redirect('friend_request_declined')  # Remplace par le nom de ta vue de confirmation
    else:
        form = DeclineFriendRequestForm()
    return render(request, 'decline_friend_request.html', {'form': form})


from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import FriendRequest, CustomUser

@login_required
def send_friend_request(request, username):
    if request.method == 'POST':
        try:
            to_user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Utilisateur introuvable'})
        
        friend_request, created = FriendRequest.objects.get_or_create(from_user=request.user, to_user=to_user)
        if created:
            return JsonResponse({'success': True, 'message': 'Demande d\'ami envoyée avec succès.'})
        else:
            return JsonResponse({'success': False, 'error': 'Demande d\'ami déjà envoyée.'})
    else:
        return JsonResponse({'success': False, 'error': 'Méthode de requête invalide'})

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import FriendRequest, CustomUser

@login_required
def send_friend_request(request, username):
    if request.method == 'POST':
        try:
            to_user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Utilisateur introuvable'})

        from_user = request.user
        if FriendRequest.objects.filter(from_user=from_user, to_user=to_user).exists():
            return JsonResponse({'success': False, 'error': 'Demande d\'ami déjà envoyée'})
        
        FriendRequest.objects.create(from_user=from_user, to_user=to_user)
        return JsonResponse({'success': True, 'message': 'Demande d\'ami envoyée avec succès'})
    else:
        return JsonResponse({'success': False, 'error': 'Méthode de requête invalide'})

@login_required
def accept_friend_request(request, request_id):
    if request.method == 'POST':
        try:
            friend_request = FriendRequest.objects.get(pk=request_id, to_user=request.user)
        except FriendRequest.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Demande d\'ami introuvable'})
        
        from_user = friend_request.from_user
        to_user = request.user
        to_user.friends.add(from_user)
        from_user.friends.add(to_user)
        
        friend_request.delete()

        return JsonResponse({'success': True, 'message': 'Demande d\'ami acceptée avec succès.'})
    else:
        return JsonResponse({'success': False, 'error': 'Méthode de requête invalide'})

@login_required
def decline_friend_request(request, request_id):
    if request.method == 'POST':
        friend_request = get_object_or_404(FriendRequest, pk=request_id, to_user=request.user)
        friend_request.delete()
        return JsonResponse({'success': True, 'message': 'Demande d\'ami refusée'})
    else:
        return JsonResponse({'success': False, 'error': 'Méthode de requête invalide'})

@login_required
def list_friend_requests(request):
    received_requests = FriendRequest.objects.filter(to_user=request.user).values('id', 'from_user__username')
    requests_list = list(received_requests)
    return JsonResponse({'friend_requests': requests_list})

@login_required
def pending_friend_requests(request):
    sent_requests = FriendRequest.objects.filter(from_user=request.user).values('id', 'to_user__username')
    requests_list = list(sent_requests)
    return JsonResponse({'pending_requests': requests_list})

@login_required
def list_friends_with_status(request):
    user = request.user
    friends_with_status = [{'username': friend.username, 'is_online': friend.is_online} for friend in user.friends.all()]
    return JsonResponse({'friends': friends_with_status})

@login_required
def update_online_status(request):
    user = request.user
    is_online = request.POST.get('is_online') == 'true'  # Assurez-vous que la valeur est passée correctement depuis JavaScript
    user.is_online = is_online
    user.save()
    return JsonResponse({'success': True})

from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from .models import CustomUser

@receiver(user_logged_in)
def user_logged_in_callback(sender, request, user, **kwargs):
    user.is_online = True
    user.save()

@receiver(user_logged_out)
def user_logged_out_callback(sender, request, user, **kwargs):
    user.is_online = False
    user.save()

# Register View
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, password=password, email=email)
        user.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

# JWT Token View
class MyTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer

# 2FA Setup View
class SetupTOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        logger.info(f"Setting up OTP device for user {user.username}")
        
        # Check if a TOTP device already exists for the user
        if TOTPDevice.objects.filter(user=user, name='default').exists():
            return Response({'message': 'TOTP device already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        device = TOTPDevice.objects.create(user=user, name='default')
        device.confirmed = True  # Mark the device as confirmed if necessary
        device.save()
        
        logger.info(f"TOTP device created for user {user.username}: {device}")
        
        return Response({'otp_setup_url': device.config_url}, status=status.HTTP_200_OK)

# 2FA Verification View
class VerifyTOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        token = request.data.get('token')
        devices = TOTPDevice.objects.filter(user=user)
        
        for device in devices:
            if device.verify_token(token):
                return Response({'message': '2FA verification successful'}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


from django.core.mail import send_mail
from django_otp.plugins.otp_email.models import EmailDevice

@login_required
@csrf_exempt
def send_otp_email(request):
    user = request.user
    logger.debug("Sending OTP email to user: %s", user.email)
    
    device, created = EmailDevice.objects.get_or_create(user=user, name='default')
    if created:
        device.confirmed = True
        device.save()
        logger.debug("Created new email device for user: %s", user.email)

    if device:
        device.generate_challenge()
        logger.debug("OTP email sent to user: %s", user.email)
        return JsonResponse({'success': True, 'message': 'Verification email sent.'})
    else:
        logger.error("Failed to send OTP email to user: %s", user.email)
        return JsonResponse({'error': 'Unable to send verification email.'}, status=400)

# def send_otp_email(request):
#     user = request.user
#     device, created = EmailDevice.objects.get_or_create(user=user, name='default')
#     if created:
#         device.confirmed = True
#         device.save()

#     if device:
#         device.generate_challenge()
#         return JsonResponse({'success': True, 'message': 'Verification email sent.'})
#     else:
#         return JsonResponse({'error': 'Unable to send verification email.'}, status=400)


logger = logging.getLogger(__name__)
debug_logger = logging.getLogger('my_debug_logger')


@login_required
@csrf_exempt
def setup_otp(request):
    if request.method == 'POST':
        user = request.user
        device, created = TOTPDevice.objects.get_or_create(user=user, name='default')
        if created:
            device.confirmed = True
            device.save()
            logger.debug('Created and confirmed TOTPDevice for user: %s', user.username)
        else:
            logger.debug('TOTPDevice already exists for user: %s', user.username)

        return JsonResponse({'success': True, 'message': 'OTP setup successfully', 'otp_setup_url': device.config_url})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)


debug_logger = logging.getLogger('my_debug_logger')

@csrf_exempt
@login_required
def verify_otp(request):
    debug_logger.debug("verify_otp called")
    debug_logger.info("CSRF Token: %s", request.META.get("CSRF_COOKIE"))
    debug_logger.info("Session Key: %s", request.session.session_key)
    debug_logger.info("User: %s", request.user)

    if request.method == 'POST':
        debug_logger.debug("Request method is POST")
        otp_token = request.POST.get('otp_token')
        debug_logger.debug("Received OTP token: %s", otp_token)

        if request.user.is_authenticated:
            debug_logger.debug("Request user: %s", request.user)
            device = TOTPDevice.objects.filter(user=request.user, confirmed=True, name='default').first()
            debug_logger.debug("Found device: %s", device)

            if device and device.verify_token(otp_token):
                debug_logger.debug("OTP matched successfully.")
                return JsonResponse({'success': True, 'access': 'dummy_access_token', 'refresh': 'dummy_refresh_token'})
            else:
                debug_logger.debug("Invalid OTP.")
                return JsonResponse({'success': False, 'error_message': 'Invalid OTP'}, status=400)
        else:
            debug_logger.debug("User not authenticated.")
            return JsonResponse({'success': False, 'error_message': 'User not authenticated'}, status=401)
    else:
        debug_logger.debug("Invalid request method.")
        return JsonResponse({'success': False, 'error_message': 'Invalid request method'}, status=405)