from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone
from django.core.exceptions import ValidationError


class Coupon(models.Model):

    code = models.CharField(max_length=50, unique=True)
    max_discount_value = models.DecimalField(
        max_digits=10, decimal_places=2,
        default=0.00, validators=[MinValueValidator(0)])

    discount_percent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MaxValueValidator(100), MinValueValidator(0)])

    created_at = models.DateTimeField(auto_now_add=True)
    expired = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def clean(self) -> None:
        if self.expired:
            if self.expired < timezone.now():
                raise ValidationError(
                    'Nao e possivel fazer um cupom com a data de experado que seja menor que hoje')
