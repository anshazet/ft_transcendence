# from django.contrib.auth.models import User
# from rest_framework import serializers
# from .models import FriendRequest

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username']

# class FriendRequestSerializer(serializers.ModelSerializer):
#     from_user = UserSerializer(read_only=True)
#     to_user = UserSerializer(read_only=True)

#     class Meta:
#         model = FriendRequest
#         fields = ['id', 'from_user', 'to_user', 'timestamp']