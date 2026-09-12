from django.core.management.base import BaseCommand
from apps.ml.services.train import SalesModelTrainer


class Command(BaseCommand):
    def handle(self, *args, **options) -> None:
        self.stdout.write(self.style.SUCCESS(
            "Iniciando treinamento do modelo de vendas..."))

        [model,
         X_test,
         y_test,
         mae,
         features_train,
         features_test,
         predictions,
         mae_simple] = SalesModelTrainer.run_training()

        self.stdout.write(
            self.style.SUCCESS(f"Treinamento finalizado! MAE: {mae:.4f}")
        )
