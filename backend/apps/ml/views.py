from rest_framework.views import APIView

from apps.ml.services.predict import PredictionService
from rest_framework.response import Response


class MlPredictionView(APIView):

    def get(self, request, product_name):
        return Response(PredictionService.predict(product_name))
