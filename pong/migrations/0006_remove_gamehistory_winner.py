# Generated by Django 4.2.9 on 2024-06-05 09:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0005_gamehistory_remove_statistic_player_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='gamehistory',
            name='winner',
        ),
    ]
