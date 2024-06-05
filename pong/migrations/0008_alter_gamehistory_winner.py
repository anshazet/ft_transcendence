# Generated by Django 4.2.9 on 2024-06-05 10:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0007_gamehistory_winner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gamehistory',
            name='winner',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='won_games', to=settings.AUTH_USER_MODEL),
        ),
    ]
