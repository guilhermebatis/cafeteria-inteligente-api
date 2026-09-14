import { get } from './api';
import { MlPrediction } from '@/types/ml';

const mlService = {
    getPrediction(productName: string) {
        return get<MlPrediction>(`/api/ml/predict/${productName}/`);
    },
};

export default mlService;
