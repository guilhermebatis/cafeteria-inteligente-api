from datetime import timedelta

from django.test import TestCase
from django.utils import timezone

from apps.coupons.models import Coupon
from django.core.exceptions import ValidationError


class CouponModelTest(TestCase):
    def test_create_coupon(self):
        coupon = Coupon.objects.create(
            code='CAFE10',
            max_discount_value=10,
            discount_percent=10,
            expired=timezone.now() + timedelta(days=7),
        )

        self.assertEqual(coupon.code, 'CAFE10')
        self.assertEqual(coupon.discount_percent, 10)
        self.assertTrue(coupon.is_active)

    def test_coupon_cannot_have_expired_date(self):
        coupon = Coupon(
            code='CAFE10',
            max_discount_value=10,
            discount_percent=10,
            expired=timezone.now() + timedelta(days=-1),
        )

        with self.assertRaises(ValidationError):
            coupon.clean()

    def test_max_discount_value_cannot_be_negative(self):
        coupon_max = Coupon(
            code='CAFE10',
            max_discount_value=-1,
            discount_percent=10,
            expired=timezone.now() + timedelta(days=7),
        )
        with self.assertRaises(ValidationError):
            coupon_max.full_clean()

    def test_discount_percent_cannot_be_zero(self):

        coupon_min = Coupon(
            code='CAFE10',
            max_discount_value=10,
            discount_percent=0,
            expired=timezone.now() + timedelta(days=7),
        )
        with self.assertRaises(ValidationError):
            coupon_min.full_clean()

    def test_discount_percent_cannot_be_greater_than_100(self):
        coupon_max = Coupon(
            code='CAFE10',
            max_discount_value=10,
            discount_percent=101,
            expired=timezone.now() + timedelta(days=7),
        )
        with self.assertRaises(ValidationError):
            coupon_max.full_clean()
