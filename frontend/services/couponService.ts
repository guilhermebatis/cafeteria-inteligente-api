import { post, get, update, remove } from './api';
import { Coupon } from '@/types/coupon';

const CouponService = {
    getCouponId(id: number) {
        return get<Coupon>(`/api/coupons/${id}/`);
    },
    getCoupon() {
        return get<Coupon[]>(`/api/coupons/`);
    },
    createCoupon(data: Coupon) {
        return post<Coupon>(`/api/coupons/`, data);
    },
    updateCoupon(id: number, data: Coupon) {
        return update<Coupon>(`/api/coupons/${id}/`, data);
    },
    deleteCoupon(id: number) {
        return remove<Coupon>(`/api/coupons/${id}/`);
    },
};

export default CouponService;
