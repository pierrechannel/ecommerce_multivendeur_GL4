from django.contrib import admin

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["nom", "slug", "parent", "taux_commission"]
    prepopulated_fields = {"slug": ("nom",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["titre", "boutique", "categorie", "prix_base", "stock", "statut", "cree_le"]
    list_filter = ["statut", "categorie"]
    search_fields = ["titre", "description"]
