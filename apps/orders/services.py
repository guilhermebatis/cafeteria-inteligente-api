from decimal import Decimal
from apps.products.models import OrderItem, Order


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


def recalculate_order_price(order):
    total_price = Decimal('0.00')
    for item in order.items.all():
        total_price += item.price * item.quantity
    order.total_price = total_price
    order.save()
