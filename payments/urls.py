from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    PaymentViewSet,
    PortefeuilleVendeurViewSet,
    ReversementViewSet,
    TransactionPortefeuilleViewSet,
    mobile_money_webhook,
)

router = DefaultRouter()
router.register("payments", PaymentViewSet)
router.register("portefeuilles", PortefeuilleVendeurViewSet)
router.register("reversements", ReversementViewSet)
router.register("transactions-portefeuille", TransactionPortefeuilleViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("webhooks/mobile-money/", mobile_money_webhook, name="mobile_money_webhook"),
]
