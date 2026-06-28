from decimal import Decimal
from apps.products.models import OrderItem, Order, Product, Ingredient, ProductIngredient, StockMovement, Payment, Customer
from django.db import transaction
from rest_framework.response import Response
from django.db.models import Sum, Avg
from io import BytesIO
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
)
from reportlab.lib.styles import getSampleStyleSheet
from django.utils import timezone
from datetime import timedelta, date
from django.db.models.functions import TruncDate


def add_item_to_order(order, product, quantity):

    if quantity <= 0:
        raise ValueError("quantity must be greater than zero")

    if not product.is_available:
        raise ValueError('Product is not available')

    item = order.items.filter(product=product).first()
    if item:
        item.quantity += quantity
        item.price = product.price
        item.save()

    else:
        item = OrderItem.objects.create(
            order=order,
            product=product,
            quantity=quantity,
            price=product.price
        )
    recalculate_order_price(order)
    return item


def remove_item_from_order(order, product):
    if not order.items.filter(product=product).exists():
        raise ValueError("Item not found in order")

    order.items.filter(product=product).delete()
    recalculate_order_price(order)


def update_item_quantity(order, product, quantity):
    if quantity <= 0:
        raise ValueError("quantity must be greater than zero")

    if not order.items.filter(product=product).exists():
        raise ValueError("Item not found in order")

    item = order.items.filter(product=product).first()

    if not item:
        raise ValueError("Item not found in order")
    item.quantity = quantity
    item.save()
    recalculate_order_price(order)
    return item


def recalculate_order_price(order):
    total_price = Decimal('0.00')
    for item in order.items.all():
        total_price += item.price * item.quantity
    order.total_price = total_price
    order.save()


def add_ingredient_to_product(product, ingredient, quantity):
    if quantity <= 0:
        raise ValueError("quantity must be greater than zero")

    product_ingredient = product.ingredients.filter(
        ingredient=ingredient).first()

    if product_ingredient:
        product_ingredient.quantity += quantity
        product_ingredient.save()
    else:
        product_ingredient = ProductIngredient.objects.create(
            product=product,
            ingredient=ingredient,
            quantity=quantity
        )
    return product_ingredient


def update_ingredient_to_product(product, ingredient, quantity):
    if quantity <= 0:
        raise ValueError("quantity must be greater than zero")

    product_ingredient = product.ingredients.filter(
        ingredient=ingredient).first()

    if not product_ingredient:
        raise ValueError("Ingredient not found in product")

    product_ingredient.quantity = quantity
    product_ingredient.save()
    return product_ingredient


def remove_ingredient_to_product(product, ingredient):
    if not product.ingredients.filter(ingredient=ingredient).exists():
        raise ValueError("Ingredient not found in product")

    product.ingredients.filter(ingredient=ingredient).delete()


def finalize_order(order):
    with transaction.atomic():
        if order.is_completed:
            raise ValueError("Order is already completed")
        if order.items.count() == 0:
            raise ValueError("Cannot finalize an empty order")
        ingredient_consumption = {}
        payment = order.payments.last()
        for item in order.items.all():
            product = item.product

            # Accumulate total ingredient consumption for the entire order
            for product_ingredient in product.ingredients.all():
                ingredient = product_ingredient.ingredient
                consumption = (product_ingredient.quantity * item.quantity)
                if ingredient not in ingredient_consumption:
                    ingredient_consumption[ingredient] = consumption
                else:
                    ingredient_consumption[ingredient] += consumption

        # Check if all ingredients have enough stock
        for ingredient, consumption in ingredient_consumption.items():
            if ingredient.stock_quantity < consumption:
                raise ValueError(
                    f'Not enough stock for ingredient {ingredient.name}')

        # If all ingredients have enough stock, we can proceed to deduct the stock
        for ingredient, consumption in ingredient_consumption.items():
            ingredient.stock_quantity -= consumption
            ingredient.save()
            StockMovement.objects.create(
                ingredient=ingredient,
                quantity=-consumption,
                movement_type='OUT',
                reason='Order Finalization'
            )

        order.is_completed = True
        order.save()


def process_payment(order, method):
    with transaction.atomic():
        if order.items.count() == 0:
            raise ValueError("Cannot pay an empty order")
        if order.payments.filter(status="APPROVED").exists():
            raise ValueError("Order already paid")
        if order.payments.filter(status="PENDING", method=method).exists():
            raise ValueError("There is already an active payment attempt")
        if method not in Payment.Method.values:
            raise ValueError("Invalid payment method")

        payment = Payment.objects.create(
            order=order,
            method=method,
            amount=order.total_price)
        return payment


def get_sales_stats():
    thirty_days_ago = timezone.now() - timedelta(days=30)
    orders = Order.objects.filter(is_completed=True,
                                  created_at__gte=thirty_days_ago)
    return ({
            "orders_count": orders.count(),
            "total_revenue":
                orders.aggregate(
                    total=Sum("total_price")
                )["total"] or 0,

            "average_ticket":
                orders.aggregate(
                    avg=Avg("total_price")
                )["avg"] or 0})


def get_sales_by_thirty_days():
    thirty_days_ago = timezone.now() - timedelta(days=30)
    orders = (Order.objects.filter(is_completed=True,
                                    created_at__gte=thirty_days_ago)
                                    .annotate(date_only=TruncDate('created_at'))
                                    .values('date_only')
                                    .annotate(revenue=Sum("total_price"))
                                    .order_by('date_only'))
    return (orders)


def get_top_products_sales():
    thirty_days_ago = timezone.now() - timedelta(days=30)
    products = Product.objects.all()
    data = []
    for product in products:
        total_sold = sum(
            item.quantity
            for item in OrderItem.objects.filter(
                product=product,
                order__is_completed=True,
                order__created_at__gte=thirty_days_ago
            )
        )
        data.append({
            "id": product.id,
            "name": product.name,
            "total_sold": total_sold
            })

    data = sorted(
        data,
        key=lambda p: p["total_sold"],
        reverse=True
    )
    return data


def get_top_customers():
    thirty_days_ago = timezone.now() - timedelta(days=30)
    customers = Customer.objects.all()
    data = []
    for customer in customers:
        total_spent = sum(
            order.total_price
            for order in Order.objects.filter(
                customer=customer,
                is_completed=True,
                created_at__gte=thirty_days_ago
            )
        )
        data.append({
            'id': customer.id,
            'name': customer.name,
            'total_spent': total_spent,
            })
    data = sorted(
        data,
        key=lambda p: p['total_spent'],
        reverse=True,
        )
    return data


def generate_sales_report():
    data_sales = get_sales_stats()
    top_products = get_top_products_sales()
    top_customers = get_top_customers()
    today_data = date.today()
    formated_data = today_data.strftime("%d/%m/%Y")
    last_30_days = today_data - timedelta(days=30)
    formated_30_day = last_30_days.strftime("%d/%m/%Y")

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer)
    styles = getSampleStyleSheet()
    elements = []
    elements.append(
        Paragraph(
            "Cafeteria Inteligente",
            styles["Title"]
            )
        )
    elements.append(
        Spacer(1, 20)
    )
    elements.append(
        Paragraph(
            "Relatório de Vendas",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            "------------------------------------"
        )
    )

    elements.append(
        Paragraph(
            "RESUMO")
    )

    elements.append(
        Paragraph(
            f"Pedidos: {data_sales.get('orders_count')}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"Receita de 30 dias: R$ {data_sales.get('total_revenue'):.2f}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"Ticket Médio: R$ {data_sales.get('average_ticket'):.2f}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            "------------------------------------"
        )
    )

    elements.append(
        Paragraph(
            "PRODUTOS MAIS VENDIDOS",
            styles["Normal"]
        )
    )

    number = 0
    for product in top_products[:5]:
        number += 1
        elements.append(
            Paragraph(
                f"{number}° {product.get('name')} - {product.get('total_sold')} vendas",
                styles["Normal"]
            )
        )

    elements.append(
        Paragraph(
            "------------------------------------"
        )
    )

    elements.append(
        Paragraph(
            "MELHORES CLIENTES"
        )
    )

    number = 0
    for customer in top_customers[:5]:
        number += 1
        elements.append(
            Paragraph(
                f"{number}° {customer.get("name")} - R${customer.get("total_spent")}",
                styles["Normal"]
            )
        )

    elements.append(
        Spacer(1, 20)
    )

    elements.append(
        Paragraph(
            f'Data de geração: {formated_data}',
            styles["Normal"]
        )
    )
    elements.append(
        Paragraph(
            f'Período: {formated_30_day} a {formated_data}',
            styles["Normal"]
        )
    )
    doc.build(elements)

    buffer.seek(0)

    return buffer.getvalue()
