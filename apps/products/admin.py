from django.contrib import admin
from django.contrib import admin
from .models import Product, Category


class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'is_available')
    list_filter = ('category', 'is_available')
    search_fields = ('nome',)


admin.site.register(Product, ProductAdmin)
admin.site.register(Category)
