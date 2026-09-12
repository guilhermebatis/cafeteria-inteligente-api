import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
from apps.ml.services.sales_data import SalesDataService
from apps.ml.services.features import SalesFeatureService


class SalesModelTrainer:
    @staticmethod
    def prepare_training_data(features: pd.DataFrame):
        features = features.dropna(
            subset=["target",
                    "rolling_mean_14",
                    "rolling_mean_7",
                    "lag_14",
                    "lag_7",
                    "lag_1"])
        X = features.drop(columns=["target", "date"])
        y = features["target"]

        return X, y

    @staticmethod
    def encode_product(X_train, X_test):
        encoder = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
        product_encoded = encoder.fit_transform(X_train[["product"]])
        X_train = X_train.drop(columns=["product"])
        X_train = pd.concat([X_train.reset_index(drop=True),
                             pd.DataFrame(product_encoded)], axis=1)
        X_train.columns = X_train.columns.astype(str)

        product_encoded_test = encoder.transform(X_test[["product"]])
        X_test = X_test.drop(columns=["product"])
        X_test = pd.concat([X_test.reset_index(drop=True),
                           pd.DataFrame(product_encoded_test)], axis=1)
        X_test.columns = X_test.columns.astype(str)
        return X_train, X_test, encoder

    @staticmethod
    def split_train_test(features):
        dates = features["date"].unique()
        dates = pd.to_datetime(dates)
        dates = sorted(dates)
        train_size = int(len(dates) * 0.8)
        cutoff_date = dates[train_size]
        features_train = features[features["date"] < cutoff_date]
        features_test = features[features["date"] >= cutoff_date]
        return features_train, features_test

    @staticmethod
    def train_model(X, y):
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)
        return model

    @staticmethod
    def evaluate_model(y_test, predictions):
        mae = mean_absolute_error(y_test, predictions)
        return mae

    @staticmethod
    def evaluate_baseline(x_test, y_test):
        mae_simple = mean_absolute_error(x_test['lag_1'], y_test)
        return mae_simple

    @staticmethod
    def save_model(model, encoder, filename="sales_model.joblib"):
        import joblib
        ml = {
            "model": model,
            "encoder": encoder
        }
        joblib.dump(ml, filename)

    @staticmethod
    def run_training():
        # Get sales data and prepare it
        data = SalesDataService.get_sales_data()
        data = SalesDataService.prepare_daily_sales(data)
        data = SalesDataService.complete_daily_sales(data)

        # Create features
        features = SalesFeatureService.create_features(data)

        # Prepare training data
        features_train, features_test = SalesModelTrainer.split_train_test(
            features)
        X_train, y_train = SalesModelTrainer.prepare_training_data(
            features_train)
        X_test, y_test = SalesModelTrainer.prepare_training_data(features_test)

        X_train, X_test, encoder = SalesModelTrainer.encode_product(
            X_train, X_test)
        model = SalesModelTrainer.train_model(X_train, y_train)
        predictions = model.predict(X_test)
        mae = SalesModelTrainer.evaluate_model(y_test, predictions)
        mae_simple = SalesModelTrainer.evaluate_baseline(X_test, y_test)
        SalesModelTrainer.save_model(model, encoder)

        return model, X_test, y_test, mae, features_train, features_test, predictions, mae_simple
