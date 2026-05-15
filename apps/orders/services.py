from decimal import Decimal
from apps.products.models import OrderItem, Order, Product, Ingredient, ProductIngredient


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

    if item.quantity <= 0:
        item.delete()
    else:
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
    if order.is_completed:
        raise ValueError("Order is already completed")
    ingredient_consumption = {}
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

    order.is_completed = True
    order.save()
