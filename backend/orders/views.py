from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Commande
from .serializers import OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering_fields = ["cree_le", "total", "statut"]

    def get_queryset(self):
        user = self.request.user
        queryset = Commande.objects.prefetch_related("lignes", "lignes__produit")
        if user.is_staff or user.role == "admin":
            return queryset
        if user.role == "vendeur":
            return queryset.filter(lignes__boutique__vendeur=user).distinct()
        return queryset.filter(client=user)

    @action(detail=True, methods=["post"], url_path="set-status")
    def set_status(self, request, pk=None):
        order = self.get_object()
        order.statut = request.data.get("statut", order.statut)
        order.save(update_fields=["statut"])
        return Response(self.get_serializer(order).data)
