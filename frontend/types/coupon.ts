export interface Coupon {
    code: string;
    max_discount_value: number;
    discount_percent: number;
    created_at: string;
    expired: string;
    is_active: boolean;
}

export interface ApplyCoupon {
    code: string;
}
