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

    def test_finalize_order_success(self):
        self.order.items.create(product=self.product, quantity=3, price=30.00)
        finalize_order(self.order)
        self.order.refresh_from_db()
        self.ingredient.refresh_from_db()
        self.assertTrue(self.order.is_completed)
        self.assertEqual(self.ingredient.stock_quantity, Decimal('94.00'))
        self.assertEqual(StockMovement.objects.count(), 1)

    def test_finalize_order_insufficient_stock(self):
        self.ingredient.stock_quantity = 1
        self.ingredient.save()
        self.order.items.create(product=self.product, quantity=3, price=30.00)
        with self.assertRaises(ValueError):
            finalize_order(self.order)
        self.order.refresh_from_db()
        self.ingredient.refresh_from_db()
        self.assertFalse(self.order.is_completed)
        self.assertEqual(self.ingredient.stock_quantity, Decimal('1.00'))
        self.assertEqual(StockMovement.objects.count(), 0)

    def test_order_finalized(self):
        self.order.items.create(product=self.product, quantity=3, price=30.00)
        finalize_order(self.order)
        with self.assertRaises(ValueError):
            finalize_order(self.order)
        self.order.refresh_from_db()
        self.ingredient.refresh_from_db()
        self.assertEqual(self.ingredient.stock_quantity, Decimal('94.00'))
        self.assertTrue(self.order.is_completed)
        self.assertEqual(StockMovement.objects.count(), 1)

    def test_acumulator_stock_insufficient(self):
        self.ingredient = Ingredient.objects.create(
            name="milk", stock_quantity=10
        )
        self.ingredient.save()
        product_milk = Product.objects.create(
            name="Milk Product", price=10.00,
            is_available=True, category=self.category
        )
        product_coffe_with_milk = Product.objects.create(
            name="Coffe with Milk", price=15.00,
            is_available=True, category=self.category
        )
        self.product_ngredient = ProductIngredient.objects.create(
            product=product_milk, ingredient=self.ingredient, quantity=5
        )
        self.product_ngredient = ProductIngredient.objects.create(
            product=product_coffe_with_milk, ingredient=self.ingredient, quantity=5
        )
        self.order.items.create(product=product_milk, quantity=1, price=10.00)
        self.order.items.create(
            product=product_coffe_with_milk, quantity=2, price=30.00)
        with self.assertRaises(ValueError):
            finalize_order(self.order)
        self.order.refresh_from_db()
        self.ingredient.refresh_from_db()
        self.assertFalse(self.order.is_completed)
        self.assertEqual(self.ingredient.stock_quantity, Decimal('10.00'))
        self.assertEqual(StockMovement.objects.count(), 0)
