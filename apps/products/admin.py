from django.contrib import admin
from .models import (Product, Order, OrderItem, Ingredient,
                     ProductIngredient, StockMovement)


class ProductIngredientInline(admin.TabularInline):
    model = ProductIngredient
    extra = 1
    fields = ('ingredient', 'quantity')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'is_available')
    list_filter = ('category', 'is_available')
    search_fields = ('name',)

    inlines = [ProductIngredientInline]


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('name', 'stock_quantity', 'minimum_stock', 'unit')
    list_filter = ('unit',)
    search_fields = ('name',)


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ('ingredient', 'quantity', 'movement_type', 'created_at')
    list_filter = ('movement_type', 'created_at')
    search_fields = ('ingredient__name',)
    readonly_fields = ('ingredient', 'quantity', 'movement_type', 'created_at')


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    exclude = ('price',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'created_at', 'is_completed')
    list_filter = ('is_completed',)
    search_fields = ('user__username',)
    readonly_fields = ('total_price', 'is_completed', 'user')

    inlines = [OrderItemInline]

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.user = request.user
        super().save_model(request, obj, form, change)


@admin.register(ProductIngredient)
class ProductIngredientAdmin(admin.ModelAdmin):
    list_display = ('product', 'ingredient', 'quantity')
    search_fields = ('product__name', 'ingredient__name')
