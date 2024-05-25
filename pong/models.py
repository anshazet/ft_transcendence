from django.db import models
import os

# class Utilisateur(models.Model):
#     username = models.CharField(max_length=100)
#     password = models.CharField(max_length=100)
#     email = models.CharField(max_length=100)



# from django.contrib.auth.models import User
# from django.db import models

# class Utilisateur(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     avatar = models.ImageField(upload_to='avatar/', default='avatar/ponguser.png')

#     class Meta:
#         db_table = 'pong_utilisateur'

# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    friends = models.ManyToManyField('self', symmetrical=False, related_name='friends_list', blank=True)
    friend_requests_sent = models.ManyToManyField('self', symmetrical=False, related_name='friend_requests_received', blank=True, through='FriendRequest')
    is_online = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = 'Utilisateur personnalisé'
        verbose_name_plural = 'Utilisateurs personnalisés'

class FriendRequest(models.Model):
    from_user = models.ForeignKey(CustomUser, related_name='sent_requests', on_delete=models.CASCADE)
    to_user = models.ForeignKey(CustomUser, related_name='received_requests', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('from_user', 'to_user')
