from . import views
from django.urls import path

urlpatterns = [
    path('predict/<str:product_name>/', views.MlPredictionView.as_view(), name='ml-predict'),]
