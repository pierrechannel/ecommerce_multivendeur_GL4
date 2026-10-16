from rest_framework import serializers

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "parent", "nom", "slug", "taux_commission"]


class ProductSerializer(serializers.ModelSerializer):
    boutique_nom = serializers.CharField(source="boutique.nom", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "boutique",
            "boutique_nom",
            "categorie",
            "titre",
            "description",
            "prix_base",
            "image_url",
            "stock",
            "seuil_alerte",
            "statut",
            "cree_le",
        ]
        read_only_fields = ["cree_le"]
