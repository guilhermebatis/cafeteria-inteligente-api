import { Product } from '@/types/products';

export interface MlPrediction {
    product: Product['name'];
    prediction: number;
}
