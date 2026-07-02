from typing import Any

from django.core.management.base import BaseCommand
from apps.products.models import (Category, Ingredient, Product,
                                  Customer, ProductIngredient, User, OrderItem,
                                  Order)
from django.utils.text import slugify
from .seed_data import (CATEGORIES, INGREDIENTS, PRODUCTS,
                        CUSTOMERS, USERS, RECIPES)
import random
from datetime import timedelta
from django.utils import timezone


class Command(BaseCommand):
    help = "Populate the database with sample data"

    def handle(self, *args: Any, **options: Any) -> str | None:
        self.stdout.write(self.style.SUCCESS("Iniciando seed..."))

        self.seed_categories()
        self.seed_ingredients()
        self.seed_products()
        self.seed_customers()
        self.seed_product_ingredients()
        self.seed_users()
        self.seed_orders()

        self.stdout.write(
            self.style.SUCCESS("Seed finalizado!")
        )

    def seed_categories(self) -> None:

        for categorie in CATEGORIES:
            Category.objects.get_or_create(
                name=categorie,
                defaults={
                    "slug": slugify(categorie)
                }
            )

        self.stdout.write(
            self.style.SUCCESS("Categorias criadas!")
        )

    def seed_ingredients(self) -> None:

        for ingredient in INGREDIENTS:
            Ingredient.objects.get_or_create(
                name=ingredient["name"],
                defaults={
                    "stock_quantity": ingredient["stock_quantity"],
                    "unit": ingredient["unit"],
                    "minimum_stock": ingredient["minimum_stock"],
                    }
                )
        self.stdout.write(
            self.style.SUCCESS("Ingredientes criados!")
            )

    def seed_products(self) -> None:

        for product in PRODUCTS:
            Product.objects.get_or_create(
                name=product["name"],
                defaults={
                    "description": product["description"],
                    "price": product["price"],
                    "category": Category.objects.get(name=product["category"]),
                    "barcode": product["barcode"],
                }
            )
        self.stdout.write(
            self.style.SUCCESS("Produtos criados!")
        )

    def seed_customers(self) -> None:

        for customer in CUSTOMERS:
            Customer.objects.get_or_create(
                name=customer["name"],
                defaults={
                    "email": customer["email"],
                    "cpf": customer["cpf"],
                    "phone": customer["phone"],
                }
            )
        self.stdout.write(
            self.style.SUCCESS("Clientes criados!")
        )

    def seed_product_ingredients(self) -> None:
        for product_name, recipe in RECIPES.items():
            try:
                product = Product.objects.get(name=product_name)
            except Product.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f"Produto '{product_name}' não encontrado.")
                )
                continue

            for ingredient_name, quantity in recipe:
                try:
                    ingredient = Ingredient.objects.get(name=ingredient_name)

                    ProductIngredient.objects.get_or_create(
                        product=product,
                        ingredient=ingredient,
                        defaults={
                            "quantity": quantity,
                        }
                    )

                except Ingredient.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Ingrediente '{ingredient_name}' não encontrado."
                        )
                    )

        self.stdout.write(
            self.style.SUCCESS("Receitas criadas!")
        )

    def seed_users(self) -> None:
        for user in USERS:

            if User.objects.filter(username=user["username"]).exists():
                continue

            if user["is_superuser"]:
                User.objects.create_superuser(
                    username=user["username"],
                    email=user["email"],
                    password=user["password"],
                    is_staff=user["is_staff"],
                )
            else:
                User.objects.get_or_create(
                    username=user["username"],
                    defaults={
                        "email": user["email"],
                        "is_staff": user["is_staff"],
                        "is_superuser": user["is_superuser"],
                    }
                )

        self.stdout.write(
            self.style.SUCCESS("Usuários criados!")
        )

    def seed_orders(self) -> None:
        customers = Customer.objects.all()
        users = User.objects.all()
        products = Product.objects.all()

        for _ in range(500):
            customer = random.choice(customers)
            user = random.choice(users)

            order = Order.objects.create(
                customer=customer,
                user=user,
                is_completed=random.choice([True, True, True, False]),
            )
            quantity_products = random.randint(1, 5)
            chosen_products = random.sample(list(products),
                                            quantity_products)

            for product in chosen_products:
                quantity = random.randint(1, 3)
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price=product.price
                )
            days = random.randint(0, 40)
            order.created_at = timezone.now() - timedelta(days=days)
            order.save(update_fields=["created_at"])

        self.stdout.write(
            self.style.SUCCESS("Pedidos criados!")
        )
