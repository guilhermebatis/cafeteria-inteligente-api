import pandas as pd


class SalesFeatureService:
    @staticmethod
    def create_features(daily_sales: pd.DataFrame) -> pd.DataFrame:
        daily_sales["date"] = pd.to_datetime(daily_sales["date"])
        daily_sales["day_of_week"] = daily_sales["date"].dt.dayofweek
        daily_sales["day_of_month"] = daily_sales["date"].dt.day
        daily_sales["day_of_year"] = daily_sales["date"].dt.day_of_year
        daily_sales = daily_sales.sort_values(by=["product", "date"])

        daily_sales["lag_1"] = (
            daily_sales.groupby("product")["quantity"].shift(1))
        daily_sales["lag_7"] = (
            daily_sales.groupby("product")["quantity"].shift(7))
        daily_sales["lag_14"] = (
            daily_sales.groupby("product")["quantity"].shift(14))
        daily_sales['rolling_mean_7'] = (
            daily_sales.groupby("product")["quantity"]
            .apply(lambda x: x.shift(1).rolling(window=7, min_periods=1).mean())
            .reset_index(level=0, drop=True))
        daily_sales['rolling_mean_14'] = (
            daily_sales.groupby("product")["quantity"]
            .apply(lambda x: x.shift(1).rolling(window=14, min_periods=1).mean())
            .reset_index(level=0, drop=True)
        )
        daily_sales['target'] = daily_sales.groupby(
            "product")["quantity"].shift(-1)
        return daily_sales
