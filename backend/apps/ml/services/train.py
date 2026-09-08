import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error


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
    def encode_product(X):
        encoder = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
        product_encoded = encoder.fit_transform(X[["product"]])
        X = X.drop(columns=["product"])
        X = pd.concat([X.reset_index(drop=True),
                      pd.DataFrame(product_encoded)], axis=1)
        X.columns = X.columns.astype(str)
        return X

    @staticmethod
    def split_train_test(X, y):
        train_size = int(len(X) * 0.8)
        X_train, X_test = X[:train_size], X[train_size:]
        y_train, y_test = y[:train_size], y[train_size:]
        return X_train, X_test, y_train, y_test

    @staticmethod
    def train_model(X, y):
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)
        return model

    @staticmethod
    def evaluate_model(y_test, predictions):
        mae = mean_absolute_error(y_test, predictions)
        return mae
