from django.db import models
import os

class Utilisateur(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.CharField(max_length=100)



# from django.contrib.auth.models import User
# from django.db import models

# class Utilisateur(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     avatar = models.ImageField(upload_to='avatar/', default='avatar/ponguser.png')

#     class Meta:
#         db_table = 'pong_utilisateur'
