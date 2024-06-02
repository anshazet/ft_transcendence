from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

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

class Game(models.Model):
    player1 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='games_as_player1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='games_as_player2', on_delete=models.CASCADE)
    player1_score = models.IntegerField()
    player2_score = models.IntegerField()
    date_played = models.DateTimeField()
    winner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='games_won', on_delete=models.CASCADE)


class Statistic(models.Model):
    player = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    games_played = models.IntegerField(default=0)
    total_score = models.IntegerField(default=0)
    win_streak = models.IntegerField(default=0)

    def update_statistics(self, score):
        self.games_played += 1
        self.total_score += score
        if score > 0:  # Supposons que le score > 0 signifie une victoire
            self.win_streak += 1
        else:
            self.win_streak = 0
        self.save()

@receiver(post_save, sender=Game)
def update_player_statistics(sender, instance, created, **kwargs):
    if created:
        statistics, _ = Statistic.objects.get_or_create(player=instance.player)
        statistics.update_statistics(instance.score)
