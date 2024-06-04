from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    friends = models.ManyToManyField('self', symmetrical=False, related_name='friends_list', blank=True)
    friend_requests_sent = models.ManyToManyField('self', symmetrical=False, related_name='friend_requests_received', blank=True, through='FriendRequest')
    is_online = models.BooleanField(default=False)
    total_games_played = models.IntegerField(default=0)
    games_won = models.IntegerField(default=0)
    game_history = models.ManyToManyField('GameHistory', related_name='players', blank=True)
    avatar = models.ImageField(upload_to='avatar/', default='avatar/ponguser.png')

    class Meta:
        verbose_name = _('Custom User')
        verbose_name_plural = _('Custom Users')

class GameHistory(models.Model):
    player1_score = models.IntegerField()
    player2_score = models.IntegerField()
    date_played = models.DateTimeField()
    winner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='won_games')

    class Meta:
        verbose_name = _('Game History')
        verbose_name_plural = _('Game Histories')

class FriendRequest(models.Model):
    from_user = models.ForeignKey(CustomUser, related_name='sent_requests', on_delete=models.CASCADE)
    to_user = models.ForeignKey(CustomUser, related_name='received_requests', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('from_user', 'to_user')

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    is_verified = models.BooleanField(default=False)

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        try:
            instance.profile.save()
        except Profile.DoesNotExist:
            Profile.objects.create(user=instance)
