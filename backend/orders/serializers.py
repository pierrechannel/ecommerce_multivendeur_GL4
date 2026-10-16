from rest_framework import serializers
from django.db import transaction

from catalog.models import Product
from .models import Commande, LigneCommande, reserve_stock


class OrderItemSerializer(serializers.ModelSerializer):
    produit_nom = serializers.CharField(source="produit.titre", read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = LigneCommande
        fields = ["id", "produit", "produit_nom", "boutique", "titre_snapshot", "prix_unitaire", "quantite", "subtotal"]
        read_only_fields = ["boutique", "titre_snapshot", "prix_unitaire"]


class OrderSerializer(serializers.ModelSerializer):
    lignes = OrderItemSerializer(many=True)

    class Meta:
        model = Commande
        fields = ["id", "client", "adresse_livraison", "total", "frais_livraison", "statut", "lignes", "cree_le"]
        read_only_fields = ["client", "statut", "total", "cree_le"]

    def create(self, validated_data):
        lignes_data = validated_data.pop("lignes")
        request = self.context["request"]
        try:
            with transaction.atomic():
                commande = Commande.objects.create(client=request.user, **validated_data)

                for ligne_data in lignes_data:
                    produit = Product.objects.get(pk=ligne_data["produit"].pk)
                    LigneCommande.objects.create(
                        commande=commande,
                        produit=produit,
                        boutique=produit.boutique,
                        titre_snapshot=produit.titre,
                        prix_unitaire=produit.prix_base,
                        quantite=ligne_data["quantite"],
                    )

                reserve_stock(commande)
                commande.recalculate_total()
                return commande
        except ValueError as exc:
            raise serializers.ValidationError({"lignes": str(exc)}) from exc
