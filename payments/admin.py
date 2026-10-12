from django.contrib import admin

from .models import Paiement, PortefeuilleVendeur, Reversement, TransactionPortefeuille


@admin.register(Paiement)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["id", "commande", "mode", "montant", "statut", "cree_le"]
    list_filter = ["mode", "statut", "cree_le"]


@admin.register(PortefeuilleVendeur)
class PortefeuilleVendeurAdmin(admin.ModelAdmin):
    list_display = ["boutique", "solde_disponible", "solde_en_attente"]


@admin.register(Reversement)
class ReversementAdmin(admin.ModelAdmin):
    list_display = ["id", "boutique", "montant", "mode", "statut", "demande_le"]
    list_filter = ["mode", "statut", "demande_le"]


@admin.register(TransactionPortefeuille)
class TransactionPortefeuilleAdmin(admin.ModelAdmin):
    list_display = ["id", "boutique", "type", "montant", "cree_le"]
    list_filter = ["type", "cree_le"]
