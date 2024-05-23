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

from django.contrib.auth.models import User
from django.db import models

class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name='sent_friend_requests', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='received_friend_requests', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_user} -> {self.to_user}"
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    friends = models.ManyToManyField('self', through='Friendship', symmetrical=False)

class Friendship(models.Model):
    from_user = models.ForeignKey(User, related_name='friendship_creator_set', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='friend_set', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_user} -> {self.to_user}"