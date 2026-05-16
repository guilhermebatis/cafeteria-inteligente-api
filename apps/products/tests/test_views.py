from rest_framework.test import APITestCase, force_authenticate
from django.contrib.auth import get_user_model
from apps.products.models import Product, Category
from django.urls import reverse
from apps.products.models import Ingredient, Product, Order, ProductIngredient, StockMovement, Category
from django.contrib.auth.models import User
from decimal import Decimal
from rest_framework import status
from apps.orders.services import add_item_to_order


class OrderViewSetTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='test',
            password='123'
        )
        self.category = Category.objects.create(
            name='Test Category'
        )
        self.ingredient = Ingredient.objects.create(
            name="Test Ingredient", stock_quantity=100
        )
        self.product = Product.objects.create(
            name="Test Product", price=10.00,
            is_available=True, category=self.category
        )
        self.product_ingredient = ProductIngredient.objects.create(
            product=self.product, ingredient=self.ingredient, quantity=2
        )
        self.order = Order.objects.create(user=self.user)

        self.client.force_authenticate(user=self.user)

    def test_finalize_order_endpoint_success(self):
        add_item_to_order(self.order, self.product, 3)
        url = reverse('orders-finalize', args=[self.order.id])
        response = self.client.post(url)
        self.order.refresh_from_db()
        self.ingredient.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self.order.is_completed)
        self.assertEqual(self.ingredient.stock_quantity, Decimal('94.00'))
        self.assertEqual(StockMovement.objects.count(), 1)
        self.assertEqual(response.data['is_completed'], True)
        self.assertEqual(response.data['total_price'], '30.00')

    def test_unauthorized_finalize_order(self):
        self.client.force_authenticate(user=None)
        url = reverse('orders-finalize', args=[self.order.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
