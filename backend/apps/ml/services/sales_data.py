import pandas as pd

from apps.products.models import OrderItem


class SalesDataService:
    @staticmethod
    def get_sales_data() -> pd.DataFrame:
        data = OrderItem.objects.values(
            "order__created_at",
            "product__name",
            "quantity",
        )

        return pd.DataFrame(data)

    @staticmethod
    def prepare_daily_sales(df: pd.DataFrame) -> pd.DataFrame:
        df = df.rename(columns={
            "order__created_at": "date",
            "product__name": "product",
        })

        df["date"] = pd.to_datetime(df["date"]).dt.date

        daily_sales = (
            df
            .groupby(["date", "product"], as_index=False)["quantity"]
            .sum()
        )

        return daily_sales

    @staticmethod
    def complete_daily_sales(daily_sales: pd.DataFrame) -> pd.DataFrame:
        all_dates = pd.date_range(
            start=daily_sales["date"].min(),
            end=daily_sales["date"].max(),
            freq="D",
        )

        products = daily_sales["product"].unique()

        complete_index = pd.MultiIndex.from_product(
            [all_dates, products],
            names=["date", "product"],
        )

        daily_sales["date"] = pd.to_datetime(
            daily_sales["date"]
        )

        daily_sales = (
            daily_sales
            .set_index(["date", "product"])
            .reindex(complete_index, fill_value=0)
            .reset_index()
        )

        daily_sales["quantity"] = (
            daily_sales["quantity"]
            .astype(int)
        )

        return daily_sales
