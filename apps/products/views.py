from django.shortcuts import render
from rest_framework import viewsets, filters
from .models import Product, Category, Order, OrderItem
from .serializers import ProductSerializer, CategorySerializer, OrderSerializer, OrderItemSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework.decorators import action
from orders.services import add_item_to_order, remove_item_from_order, update_item_quantity


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = ['category', 'is_available']

    search_fields = ['name', 'description']

    ordering_fields = ['price', 'created_at']


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]

    search_fields = ['name']


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_item(self, request):
        order = self.get_object()
        product_id = self.request.data.get('product_id')
        product = Product.objects.filter(id=product_id).first()
        quantity = self.request.data.get('quantity')
        add_item_to_order(order, product, quantity)
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['delete'])
    def remove_item(self, request):
        order = self.get_object()
        product_id = self.request.data.get('product_id')
        product = Product.objects.filter(id=product_id).first()
        remove_item_from_order(order, product)
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_item(self, request):
        order = self.get_object()
        product_id = self.request.data.get('product_id')
        product = Product.objects.filter(id=product_id).first()
        quantity = self.request.data.get('quantity')
        update_item_quantity(order, product, quantity)
        serializer = self.get_serializer(order)
        return Response(serializer.data)
