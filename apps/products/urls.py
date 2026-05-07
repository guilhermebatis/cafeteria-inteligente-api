from rest_framework.routers import DefaultRouter
from django.urls import path, include

from .views import ProductViewSet, MeView, CategoryViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')

urlpatterns = [
    path('', include(router.urls)),
    path('me/', MeView.as_view()),
]
