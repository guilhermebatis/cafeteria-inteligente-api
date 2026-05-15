from django.test import TestCase
from apps.products.models import Ingredient, Product, Order, ProductIngredient, StockMovement, Category
from django.contrib.auth.models import User
from apps.orders.services import finalize_order
from decimal import Decimal


class FinalizeOrderTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='test',
            password='123'
        )

    def test_finalize_order_success(self):
        category = Category.objects.create(
            name='Test Category'
        )
        ingredient = Ingredient.objects.create(
            name="Test Ingredient", stock_quantity=100)
        product = Product.objects.create(
            name="Test Product", price=10.00,
            is_available=True, category=category)
        ProductIngredient.objects.create(
            product=product, ingredient=ingredient, quantity=2
        )

        order = Order.objects.create(user=self.user)
        order.items.create(product=product, quantity=3, price=30.00)
        finalize_order(order)
        order.refresh_from_db()
        ingredient.refresh_from_db()
        self.assertTrue(order.is_completed)
        self.assertEqual(ingredient.stock_quantity, Decimal('94.00'))
        self.assertEqual(StockMovement.objects.count(), 1)
