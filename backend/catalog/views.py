from rest_framework import permissions, viewsets

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class IsVendorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role in ["vendeur", "admin"]

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff or obj.boutique.vendeur_id == request.user.id


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    search_fields = ["nom"]
    ordering_fields = ["nom"]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("boutique", "categorie")
    serializer_class = ProductSerializer
    permission_classes = [IsVendorOrReadOnly]
    search_fields = ["titre", "description", "categorie__nom"]
    ordering_fields = ["prix_base", "cree_le", "stock"]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get("category")
        boutique = self.request.query_params.get("boutique")
        if category:
            queryset = queryset.filter(categorie__slug=category)
        if boutique:
            queryset = queryset.filter(boutique_id=boutique)
        return queryset
