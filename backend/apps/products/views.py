from rest_framework import viewsets, filters
from .models import (Product, Category, Order, Ingredient,
                     ProductIngredient, StockMovement, Payment)
from .serializers import (ProductSerializer, CategorySerializer, OrderSerializer,
                          AddStockSerializer, AddItemSerializer, IngredientSerializer,
                          ProductIngredientSerializer, AddIngredientSerializer, RemoveIngredientSerializer,
                          StockMovementSerializer, PaymentSerializer, PaymentInputSerializer,
                          ApprovePaymentSerializer)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework.decorators import action
from apps.orders.services import (add_item_to_order, remove_item_from_order,
                                  update_item_quantity, add_ingredient_to_product,
                                  update_ingredient_to_product, remove_ingredient_to_product,
                                  finalize_order, process_payment)
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import DjangoModelPermissions, IsAuthenticated


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_available=True)
    serializer_class = ProductSerializer
    permission_classes = [DjangoModelPermissions]

    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter,
                       filters.OrderingFilter,
                       filters.SearchFilter]

    filterset_fields = ['category', 'is_available']

    search_fields = ['name', 'description']

    ordering_fields = ['price', 'created_at']

    def get_serializer_class(self):
        if self.action in ['add_ingredient', 'update_ingredient']:
            return AddIngredientSerializer

        if self.action == 'remove_ingredient':
            return RemoveIngredientSerializer

        return super().get_serializer_class()

    @action(detail=True, methods=['post'])
    def add_ingredient(self, request, pk=None):
        serializer = AddIngredientSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = self.get_object()
        ingredient_id = serializer.validated_data['ingredient_id']
        ingredient = Ingredient.objects.filter(id=ingredient_id).first()
        quantity = serializer.validated_data.get('quantity')
        add_ingredient_to_product(product, ingredient, quantity)
        serializer = ProductIngredientSerializer(
            product.ingredients.all(), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_ingredient(self, request, pk=None):
        serializer = AddIngredientSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = self.get_object()
        ingredient_id = serializer.validated_data['ingredient_id']
        ingredient = Ingredient.objects.filter(id=ingredient_id).first()
        quantity = serializer.validated_data.get('quantity')
        update_ingredient_to_product(product, ingredient, quantity)
        serializer = ProductIngredientSerializer(
            product.ingredients.all(), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def remove_ingredient(self, request, pk=None):
        serializer = RemoveIngredientSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = self.get_object()
        ingredient_id = serializer.validated_data['ingredient_id']
        ingredient = Ingredient.objects.filter(id=ingredient_id).first()
        remove_ingredient_to_product(product, ingredient)
        serializer = ProductIngredientSerializer(
            product.ingredients.all(), many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_barcode(self, request):
        barcode = request.query_params.get('barcode')
        if not barcode:
            return Response({'error': 'Barcode is required'},
                            status=status.HTTP_400_BAD_REQUEST)
        product = Product.objects.filter(barcode=barcode).first()
        if not product:
            return Response({'error': 'Product not found'},
                            status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(product)
        return Response(serializer.data)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [DjangoModelPermissions]

    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter,
                       filters.SearchFilter]

    search_fields = ['name']


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=True, methods=['post'], serializer_class=AddItemSerializer)
    def add_item(self, request, pk=None):
        order = self.get_object()
        if order.is_completed:
            raise ValueError("Cannot modify completed order")
        serializer = AddItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_id = serializer.validated_data.get('product_id')
        product = Product.objects.filter(id=product_id).first()
        quantity = serializer.validated_data.get('quantity')
        add_item_to_order(order, product, quantity)
        order.refresh_from_db()
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['delete'])
    def remove_item(self, request, pk=None):
        order = self.get_object()
        if order.is_completed:
            raise ValueError("Cannot modify completed order")
        product_id = self.request.data.get('product_id')
        product = Product.objects.filter(id=product_id).first()
        remove_item_from_order(order, product)
        order.refresh_from_db()
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], serializer_class=AddItemSerializer)
    def update_item(self, request, pk=None):
        order = self.get_object()
        if order.is_completed:
            raise ValueError("Cannot modify completed order")
        serializer = AddItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product_id = serializer.validated_data['product_id']
        product = Product.objects.filter(id=product_id).first()
        update_item_quantity(
            order, product, serializer.validated_data['quantity'])
        order.refresh_from_db()
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    @extend_schema(request=None, responses=OrderSerializer)
    @action(detail=True, methods=['post'])
    def finalize(self, request, pk=None):
        order = self.get_object()
        try:
            finalize_order(order)
        except ValueError as e:
            return Response({'error': str(e)}, status=400)
        serializer = OrderSerializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def checkout(self, request, pk=None):
        order = self.get_object()
        if order.items.count() == 0:
            return Response({'error': 'Cannot checkout an empty order'},
                            status=400)
        order.is_completed = True
        order.save()
        return Response(OrderSerializer(order).data)

    @action(detail=False, methods=['get'])
    def history(self, request, pk=None):
        user = request.user
        orders = Order.objects.filter(user=user, is_completed=True)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def current(self, request):
        user = request.user
        order = Order.objects.filter(user=user, is_completed=False).first()
        if not order:
            return Response(None, status=404)
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'],
            serializer_class=PaymentInputSerializer)
    def pay(self, request, pk=None):
        order = self.get_object()
        serializer = PaymentInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            payment = process_payment(order,
                                      serializer.validated_data["method"])

        except ValueError as e:
            return Response({'error': str(e)}, status=400)

        return Response(PaymentSerializer(payment).data)

    @action(detail=True, methods=['post'],
            serializer_class=ApprovePaymentSerializer)
    def approve_payment(self, request, pk=None):
        order = self.get_object()
        payment = order.payments.last()

        if not payment:
            return Response({"error": "No payment found"}, status=404)

        if payment.status == "APPROVED":
            return Response({"error": "Payment already approved"}, status=400)

        try:
            payment.status = "APPROVED"
            payment.save()
        except ValueError as e:
            return Response({'error': str(e)}, status=400)

        return Response(PaymentSerializer(payment).data)


class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [DjangoModelPermissions]

    @action(detail=True, methods=['post'])
    def add_stock(self, request, pk=None):
        serializer = AddStockSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ingredient = self.get_object()
        quantity = serializer.validated_data['quantity']
        reason = serializer.validated_data['reason']
        ingredient.stock_quantity += quantity
        ingredient.save()
        stock_movement = StockMovement.objects.create(
            ingredient=ingredient,
            quantity=quantity,
            movement_type='IN',
            reason=reason,
        )
        stock_movement.save()
        return Response({'status': 'stock added',
                         'new_stock': ingredient.stock_quantity})


class ProductIngredientViewSet(viewsets.ModelViewSet):
    queryset = ProductIngredient.objects.all()
    serializer_class = ProductIngredientSerializer
    permission_classes = [DjangoModelPermissions]


class StockMovementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [DjangoModelPermissions]

    filter_backends = [DjangoFilterBackend,
                       filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['movement_type', 'ingredient']
    ordering_fields = ['created_at']
    search_fields = ['ingredient__name']
