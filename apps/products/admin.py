from django.contrib import admin
from .models import Product, Category, Order, OrderItem, Ingredient, ProductIngredient, StockMovement


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'is_available')
    list_filter = ('category', 'is_available')
    search_fields = ('name',)


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


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'created_at')
    list_filter = ('is_completed',)
    search_fields = ('user__username',)
    readonly_fields = ('total_price', 'is_completed', 'user')

    class OrderItemInline(admin.TabularInline):
        model = OrderItem
        extra = 0
        exclude = ('price',)

    inlines = [OrderItemInline]

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.user = request.user
        super().save_model(request, obj, form, change)
