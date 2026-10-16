from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response

from backend.orders.models import Commande
from .models import Paiement, PortefeuilleVendeur, Reversement, TransactionPortefeuille
from .serializers import (
    PaymentSerializer,
    PortefeuilleVendeurSerializer,
    ReversementSerializer,
    TransactionPortefeuilleSerializer,
)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Paiement.objects.select_related("commande", "commande__client")
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        if user.is_staff or user.role == "admin":
            return queryset
        return queryset.filter(commande__client=user)

    @action(detail=False, methods=["post"], url_path="initiate")
    def initiate(self, request):
        commande = Commande.objects.get(pk=request.data["commande"])
        if not (request.user.is_staff or request.user.role == "admin" or commande.client_id == request.user.id):
            return Response({"detail": "Vous ne pouvez payer que vos propres commandes."}, status=status.HTTP_403_FORBIDDEN)
        payment, _ = Paiement.objects.update_or_create(
            commande=commande,
            defaults={
                "mode": request.data.get("mode", Paiement.Mode.MOBILE_MONEY),
                "montant": commande.total,
                "statut": Paiement.Status.INITIE,
            },
        )
        return Response(self.get_serializer(payment).data, status=status.HTTP_201_CREATED)


class PortefeuilleVendeurViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PortefeuilleVendeur.objects.select_related("boutique", "boutique__vendeur")
    serializer_class = PortefeuilleVendeurSerializer
    permission_classes = [permissions.IsAuthenticated]


class ReversementViewSet(viewsets.ModelViewSet):
    queryset = Reversement.objects.select_related("boutique", "traite_par")
    serializer_class = ReversementSerializer
    permission_classes = [permissions.IsAuthenticated]


class TransactionPortefeuilleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TransactionPortefeuille.objects.select_related("boutique", "reversement")
    serializer_class = TransactionPortefeuilleSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def mobile_money_webhook(request):
    reference = request.data.get("reference", "")
    payment_id = request.data.get("payment_id")
    payment = Paiement.objects.get(pk=payment_id)
    if request.data.get("statut") in ["success", "reussi"]:
        payment.mark_success(reference=reference, payload=request.data)
    else:
        payment.statut = Paiement.Status.ECHOUE
        payment.save(update_fields=["statut"])
    return Response({"ok": True})
