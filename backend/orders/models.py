import uuid

from django.conf import settings
from django.db import models, transaction

from backend.catalog.models import Product
from backend.users.models import Adresse, Boutique


class Panier(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="panier")
    mis_a_jour_le = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "panier"

    def __str__(self):
        return f"Panier {self.client}"


class LignePanier(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    panier = models.ForeignKey(Panier, on_delete=models.CASCADE, related_name="lignes")
    produit = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="lignes_panier")
    quantite = models.PositiveIntegerField()

    class Meta:
        db_table = "ligne_panier"
        unique_together = ["panier", "produit"]

    def __str__(self):
        return f"{self.quantite} x {self.produit}"


class Commande(models.Model):
    class Status(models.TextChoices):
        EN_ATTENTE_PAIEMENT = "en_attente_paiement", "En attente paiement"
        PAYEE = "payee", "Payee"
        ANNULEE = "annulee", "Annulee"
        CLOTUREE = "cloturee", "Cloturee"

    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="orders")
    adresse_livraison = models.ForeignKey(Adresse, on_delete=models.PROTECT, related_name="commandes")
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    frais_livraison = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    statut = models.CharField(max_length=30, choices=Status.choices, default=Status.EN_ATTENTE_PAIEMENT)
    cree_le = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "commande"
        ordering = ["-cree_le"]

    def recalculate_total(self):
        self.total = self.frais_livraison + sum(ligne.subtotal for ligne in self.lignes.all())
        self.save(update_fields=["total"])

    def __str__(self):
        return f"Commande #{self.pk}"


class LigneCommande(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    commande = models.ForeignKey(Commande, on_delete=models.CASCADE, related_name="lignes")
    produit = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="lignes_commande")
    boutique = models.ForeignKey(Boutique, on_delete=models.PROTECT, related_name="lignes_commande")
    titre_snapshot = models.CharField(max_length=200)
    prix_unitaire = models.DecimalField(max_digits=12, decimal_places=2)
    quantite = models.PositiveIntegerField()

    @property
    def subtotal(self):
        return self.quantite * self.prix_unitaire

    class Meta:
        db_table = "ligne_commande"


def reserve_stock(commande):
    with transaction.atomic():
        lignes = LigneCommande.objects.filter(commande=commande).select_related("produit")
        for ligne in lignes:
            produit = Product.objects.select_for_update().get(pk=ligne.produit_id)
            if produit.stock < ligne.quantite:
                raise ValueError(f"Stock insuffisant pour {produit.titre}")
            produit.stock -= ligne.quantite
            produit.save(update_fields=["stock"])


# Backward-compatible aliases for early MVP code.
Order = Commande
OrderItem = LigneCommande
