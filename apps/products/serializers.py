from rest_framework import serializers
from .models import Product
from django.contrib.auth.models import User


class ProductSerializer(serializers.ModelSerializer):
    caterory = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
