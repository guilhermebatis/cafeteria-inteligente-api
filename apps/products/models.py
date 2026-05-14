from django.db import models
from django.core.validators import MinValueValidator
from django.utils.text import slugify
from django.contrib.auth.models import User


class Category(models.Model):

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2,
                                validators=[MinValueValidator(0.01)])
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name='products')
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f'{self.name} - {self.price}'


class Order(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f'Order {self.id} - {self.user.username}'


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    class Meta:
        unique_together = ['order', 'product']

    def __str__(self):
        return f'{self.product.name} X {self.quantity}'


class Ingredient(models.Model):
    UNITS = (
        ('g', 'Grams'),
        ('kg', 'Kilograms'),
        ('ml', 'Milliliters'),
        ('l', 'Liters'),
    )

    name = models.CharField(max_length=100,)
    stock_quantity = models.DecimalField(
        default=0, max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, choices=UNITS)
    minimum_stock = models.DecimalField(
        default=0, decimal_places=2, max_digits=10)
    created_at = models.DateTimeField(auto_now_add=True)


class ProductIngredient(models.Model):
    product = models.ForeignKey(
        Product, related_name='ingredients', on_delete=models.CASCADE)
    ingredient = models.ForeignKey(
        Ingredient, related_name='products', on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ['product', 'ingredient']
