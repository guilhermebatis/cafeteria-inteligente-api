from .models import Coupon
from rest_framework import serializers
from django.utils import timezone


class CouponSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coupon
        fields = '__all__'
        read_only_fields = ["created_at"]

    def validate_expired(self, value):
        if value < timezone.now():
            raise serializers.ValidationError(
                'Não é possível criar um cupom com data de expiração anterior à data atual.')
        return value
