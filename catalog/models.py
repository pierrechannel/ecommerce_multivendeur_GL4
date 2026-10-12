import uuid

from django.db import models
from users.models import Boutique


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.SET_NULL, related_name="children")
    nom = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    taux_commission = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = "categorie"
        verbose_name_plural = "categories"

    def __str__(self):
        return self.nom


class Product(models.Model):
    class Statut(models.TextChoices):
        ACTIF = "actif", "Actif"
        INACTIF = "inactif", "Inactif"
        MODERE = "modere", "Modere"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    boutique = models.ForeignKey(Boutique, on_delete=models.CASCADE, related_name="produits")
    categorie = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="produits")
    titre = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    prix_base = models.DecimalField(max_digits=12, decimal_places=2)
    image_url = models.TextField(blank=True)
    stock = models.PositiveIntegerField(default=0)
    seuil_alerte = models.PositiveIntegerField(default=5)
    statut = models.CharField(max_length=20, choices=Statut.choices, default=Statut.ACTIF)
    cree_le = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "produit"
        ordering = ["-cree_le"]

    def __str__(self):
        return self.titre
