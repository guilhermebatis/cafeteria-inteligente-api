from apps.ml.services.sales_data import SalesDataService
from apps.ml.services.features import SalesFeatureService
import joblib
import pandas as pd


class PredictionService():

    @staticmethod
    def get_product_history(product_name):
        data = SalesDataService.get_sales_data()
        data = SalesDataService.prepare_daily_sales(data)
        data = data[data["product"] == product_name]
        data = SalesDataService.complete_daily_sales(data)
        return data.sort_values(by="date", ascending=False)

    @staticmethod
    def predict(product_name):
        data = PredictionService.get_product_history(product_name)
        data = SalesFeatureService.create_features(data)
        data = data.tail(1)
        data = data[["quantity",
                     "day_of_week",
                     "day_of_month",
                     "day_of_year",
                     "lag_1",
                     "lag_7",
                     "lag_14",
                     "rolling_mean_7",
                     "rolling_mean_14"]]
        data = data.reset_index(drop=True)

        model_data = joblib.load("/app/sales_model.joblib")
        model = model_data["model"]
        encoder = model_data["encoder"]
        product_data = pd.DataFrame({
            "product": [product_name]
        })
        product_encoded = encoder.transform(product_data)
        product_encoded = pd.DataFrame(product_encoded)
        product_encoded.columns = product_encoded.columns.astype(str)

        data_formated = pd.concat([data, pd.DataFrame(
            product_encoded, )], axis=1)

        prediction = model.predict(data_formated)

        return {
            "product": product_name,
            "prediction": float(prediction[0])}
