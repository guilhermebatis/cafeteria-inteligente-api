from rest_framework import serializers
from .models import Product, Category, OrderItem, Order, Ingredient, ProductIngredient
from django.contrib.auth.models import User


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'total_price', 'items']


class AddItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(min_value=0)
    quantity = serializers.IntegerField(min_value=1)


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'


class ProductIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductIngredient
        fields = '__all__'


class AddIngredientSerializer(serializers.Serializer):
    ingredient_id = serializers.IntegerField(min_value=0)
    quantity = serializers.DecimalField(
        min_value=0, max_digits=10, decimal_places=2)
