from rest_framework import viewsets

from .models import Coupon
from .serializers import CouponSerializer
from rest_framework.permissions import DjangoModelPermissions


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [DjangoModelPermissions]
