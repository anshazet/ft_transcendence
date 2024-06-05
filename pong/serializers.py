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

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Message, BlockedUser, CustomUser

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class BlockedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedUser
        fields = '__all__'

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
