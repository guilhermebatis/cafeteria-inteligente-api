from django.core.management.base import BaseCommand
from apps.products.models import (Product, Customer, OrderItem, Order, User)
import random
from datetime import timedelta
from django.utils import timezone
from typing import Any


class Command(BaseCommand):

    def handle(self, *args: Any, **options: Any) -> None:
        self.stdout.write(self.style.SUCCESS("Iniciando seed ml..."))

        self.seed_orders_ml()

        self.stdout.write(
            self.style.SUCCESS("Seed finalizado!")
        )

    def seed_orders_ml(self) -> None:
        customers = Customer.objects.all()
        products = Product.objects.all()
        users = User.objects.all()

        CATEGORY_DEMAND = {
            "Cafés": 1.5,
            "Bebidas": 1.2,
            "Doces": 0.9,
            "Salgados": 1.1,
            "Combos": 1.3,
            "Chás": 0.8,
            "Bebidas Geladas": 0.8,
        }

        BASE_DEMAND = 2

        DEMAND = {
            0: 0.6,  # Segunda-feira
            1: 0.8,  # Terça-feira
            2: 1.0,  # Quarta-feira
            3: 1.2,  # Quinta-feira
            4: 1.2,  # Sexta-feira
            5: 1.6,  # Sábado
            6: 1.6  # Domingo
        }

        days = 0

        for _ in range(180):
            days = days + 1
            date = timezone.now() - timedelta(days=days)
            day_of_week = date.weekday()

            demand_factor = DEMAND[day_of_week]

            customer = random.choice(customers)
            user = random.choice(users)

            for _ in range(random.randint(1, 5)):

                order = Order.objects.create(
                    customer=customer,
                    user=user,
                    is_completed=True,
                    created_at=date

                )
                order.created_at = date
                order.save(update_fields=["created_at"])

                quantity_products = max(int(
                    BASE_DEMAND * demand_factor * random.uniform(0.8, 1.2)), 1)
                chosen_products = random.sample(list(products),
                                                quantity_products)
                for product in chosen_products:
                    category_name = product.category.name
                    category_factor = CATEGORY_DEMAND[category_name]
                    quantity = max(int(BASE_DEMAND * demand_factor *
                                       category_factor * random.uniform(0.8, 1.2)), 1)

                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=quantity,
                        price=product.price
                    )

        self.stdout.write(
            self.style.SUCCESS("Pedidos para o ml criados!")
        )
