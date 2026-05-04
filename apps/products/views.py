from django.shortcuts import render
from rest_framework import viewsets, filters
from .models import Product
from .serializers import ProductSerializer
from django_filters.rest_framework import DjangoFilterBackend


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = ['category', 'is_available']

    search_fields = ['name', 'description']

    ordering_fields = ['price', 'created_at']
