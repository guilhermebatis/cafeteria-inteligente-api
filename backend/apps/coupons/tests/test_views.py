from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from apps.coupons.models import Coupon
from django.contrib.auth.models import User, Permission
from apps.products.models import Order, Product, OrderItem, Category
from datetime import timedelta
from django.utils import timezone


class CouponCRUDAPITest(APITestCase):

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="test",
            password="123"
        )

        permission = Permission.objects.get(
            codename="add_coupon"
        )

        self.user.user_permissions.add(permission)

        self.client.force_authenticate(
            user=self.user
        )

    def test_create_coupon(self):
        data = {
            "code": "CAFE10",
            "max_discount_value": "10.00",
            "discount_percent": "10.00",
            "expired": "2026-09-10T12:00:00Z",
            "is_active": True
        }

        response = self.client.post(
            path="/api/coupons/",
            data=data,
            format="json",
        )

        self.assertEqual(response.data["code"], "CAFE10")
        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )
        self.assertEqual(Coupon.objects.count(), 1)

    def test_create_invalid_coupon(self):
        data = {
            "code": "CAFE10",
            "max_discount_value": "10.00",
            "discount_percent": "101.00",
            "expired": "2026-09-10T12:00:00Z",
            "is_active": True
        }
        response = self.client.post(
            path="/api/coupons/",
            data=data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Coupon.objects.count(), 0)

    def test_get_coupons(self):
        data = {
            "code": "CAFE10",
            "max_discount_value": "10.00",
            "discount_percent": "10.00",
            "expired": "2026-09-10T12:00:00Z",
            "is_active": True
        }

        self.client.post(
            path="/api/coupons/",
            data=data,
            format="json",
        )

        response = self.client.get(path="/api/coupons/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["code"], "CAFE10")

    def test_patch_coupon(self):

        permission = Permission.objects.get(
            codename="change_coupon"
        )
        self.user.user_permissions.add(permission)

        data = {
            "code": "CAFE10",
            "max_discount_value": "10.00",
            "discount_percent": "10.00",
            "expired": "2026-09-10T12:00:00Z",
            "is_active": True
        }
        patch_data = {
            "code": "CAFE20",
        }
        response = self.client.post(
            path="/api/coupons/",
            data=data,
            format="json",
        )

        coupon_id = response.data["id"]

        response = self.client.patch(
            path=f"/api/coupons/{coupon_id}/",
            data=patch_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["code"], "CAFE20")

    def test_delete_coupon(self):

        permission = Permission.objects.get(
            codename="delete_coupon"
        )
        self.user.user_permissions.add(permission)

        data = {
            "code": "CAFE10",
            "max_discount_value": "10.00",
            "discount_percent": "10.00",
            "expired": "2026-09-10T12:00:00Z",
            "is_active": True
        }

        response = self.client.post(
            path="/api/coupons/",
            data=data,
            format="json",
        )

        coupon_id = response.data["id"]

        response = self.client.delete(
            path=f"/api/coupons/{coupon_id}/",
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Coupon.objects.count(), 0)


class CouponBusinessRulesAPITest(APITestCase):

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="test",
            password="123"
        )

        self.client.force_authenticate(
            user=self.user
        )
        self.order = Order.objects.create(
            user=self.user
        )

        self.coupon = Coupon.objects.create(
            code="CAFE10",
            max_discount_value=10,
            discount_percent=10,
            expired=timezone.now() + timedelta(days=7),
            is_active=True
        )

        self.category = Category.objects.create(
            name="cafe",
        )

        self.product = Product.objects.create(
            name="cafe americano",
            category=self.category,
            price=10
        )

        self.oderItem = OrderItem.objects.create(
            order=self.order,
            product=self.product,
            quantity=1
        )

    def test_apply_coupon_non_existent(self):
        response = self.client.post(
            f"/api/orders/{self.order.id}/apply_coupon/",
            data={"code": "NAOEXISTE"},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_apply_coupon(self):
        response = self.client.post(
            f"/api/orders/{self.order.id}/apply_coupon/",
            data={"code": "CAFE10"},
            format="json",
        )

        self.order.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.order.coupon, self.coupon)

    def test_apply_coupon_Inative(self):
        self.coupon = Coupon.objects.create(
            code="CAFE20",
            max_discount_value=10,
            discount_percent=10,
            expired=timezone.now() + timedelta(days=7),
            is_active=False
        )

        response = self.client.post(
            f"/api/orders/{self.order.id}/apply_coupon/",
            data={"code": "CAFE20"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_apply_coupon_expirate(self):
        self.coupon = Coupon.objects.create(
            code="CAFE20",
            max_discount_value=10,
            discount_percent=10,
            expired=timezone.now() + timedelta(days=-1),
            is_active=True
        )

        response = self.client.post(
            f"/api/orders/{self.order.id}/apply_coupon/",
            data={"code": "CAFE20"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_apply_coupon_finalized_order(self):
        self.order = Order.objects.create(
            user=self.user,
            is_completed=True
        )

        response = self.client.post(
            f"/api/orders/{self.order.id}/apply_coupon/",
            data={"code": "CAFE10"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_apply_nocode_coupon(self):
        response = self.client.post(
            f"/api/orders/{self.order.id}/apply_coupon/",
            data={"code": ""},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_calculate_discont_coupon(self):
        response = self.client.post(
            f"/api/orders/{self.order.id}/apply_coupon/",
            data={"code": "CAFE10"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_price"], "9.00")

    def test_calculate_max_discont(self):
        self.coupon = Coupon.objects.create(
            code="CAFE50",
            max_discount_value=1,
            discount_percent=50,
            expired=timezone.now() + timedelta(days=7),
            is_active=True
        )

        response = self.client.post(
            f"/api/orders/{self.order.id}/apply_coupon/",
            data={"code": "CAFE50"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_price"], "9.00")

    def test_no_max_discont_value(self):
        self.coupon = Coupon.objects.create(
            code="CAFE50",
            max_discount_value=0,
            discount_percent=50,
            expired=timezone.now() + timedelta(days=7),
            is_active=True
        )

        response = self.client.post(
            f"/api/orders/{self.order.id}/apply_coupon/",
            data={"code": "CAFE50"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_price"], "5.00")

    def test_apply_coupon_other_user_order(self):
        user_2 = User.objects.create_user(
            username="test_2",
            password="456"
        )
        order = Order.objects.create(
            user=user_2
        )

        oderItem = OrderItem.objects.create(
            order=order,
            product=self.product,
            quantity=1
        )

        response = self.client.post(
            f"/api/orders/{order.id}/apply_coupon/",
            data={"code": "CAFE10"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
