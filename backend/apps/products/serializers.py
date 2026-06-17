from rest_framework import serializers
from .models import (Product, Category, OrderItem, Order,
                     Ingredient, ProductIngredient, StockMovement,
                     Payment, Customer)
from django.contrib.auth.models import User


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email',
                  'password', 'is_staff', 'is_active',]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class AddItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(min_value=0)
    quantity = serializers.IntegerField(min_value=1)


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'

    def validate_stock_quantity(self, value):

        if value < 0:
            raise serializers.ValidationError(
                "Stock cannot be negative"
            )

        return value


class ProductIngredientSerializer(serializers.ModelSerializer):

    ingredient = IngredientSerializer(read_only=True)

    class Meta:
        model = ProductIngredient
        exclude = ['id', 'product']


class ProductSerializer(serializers.ModelSerializer):

    category = CategorySerializer(read_only=True)

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source = 'category',
        write_only=True
        )

    ingredients = ProductIngredientSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'


class AddIngredientSerializer(serializers.Serializer):
    ingredient_id = serializers.IntegerField(min_value=0)
    quantity = serializers.DecimalField(
        min_value=0, max_digits=10, decimal_places=2)


class RemoveIngredientSerializer(serializers.Serializer):
    ingredient_id = serializers.IntegerField(min_value=0)


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer = CustomerSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'customer',
            'created_at',
            'total_price',
            'items',
            'is_completed'
        ]
        read_only_fields = ['user']


class StockMovementSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)

    class Meta:
        model = StockMovement
        fields = '__all__'


class AddStockSerializer(serializers.Serializer):
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2)
    reason = serializers.CharField(max_length=255)


class PaymentInputSerializer(serializers.Serializer):
    method = serializers.ChoiceField(choices=Payment.Method.choices)


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"


class ApprovePaymentSerializer(serializers.Serializer):
    pass
