from rest_framework import serializers

from .models import Paiement, PortefeuilleVendeur, Reversement, TransactionPortefeuille


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paiement
        fields = [
            "id",
            "commande",
            "mode",
            "reference_externe",
            "montant",
            "statut",
            "cree_le",
        ]
        read_only_fields = ["montant", "statut", "reference_externe", "cree_le"]


class PortefeuilleVendeurSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortefeuilleVendeur
        fields = ["boutique", "solde_disponible", "solde_en_attente"]


class ReversementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reversement
        fields = ["id", "boutique", "montant", "mode", "compte_destination", "statut", "demande_le", "traite_par", "traite_le"]
        read_only_fields = ["statut", "demande_le", "traite_par", "traite_le"]


class TransactionPortefeuilleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionPortefeuille
        fields = ["id", "boutique", "reversement", "type", "montant", "cree_le"]
        read_only_fields = ["cree_le"]
