from django.contrib import admin

from .models import Commande, LigneCommande, LignePanier, Panier


class OrderItemInline(admin.TabularInline):
    model = LigneCommande
    extra = 0
    readonly_fields = ["boutique", "titre_snapshot", "prix_unitaire"]


@admin.register(Commande)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "client", "statut", "total", "frais_livraison", "cree_le"]
    list_filter = ["statut", "cree_le"]
    inlines = [OrderItemInline]


class LignePanierInline(admin.TabularInline):
    model = LignePanier
    extra = 0


@admin.register(Panier)
class PanierAdmin(admin.ModelAdmin):
    list_display = ["id", "client", "mis_a_jour_le"]
    inlines = [LignePanierInline]
