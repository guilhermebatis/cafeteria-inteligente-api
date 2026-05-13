from rest_framework.routers import DefaultRouter
from django.urls import path, include

from .views import ProductViewSet, MeView, CategoryViewSet, OrderViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'orders', OrderViewSet, basename='orders')

urlpatterns = [
    path('', include(router.urls)),
    path('users/me/', MeView.as_view()),
]
