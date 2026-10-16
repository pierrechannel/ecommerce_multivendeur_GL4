import uuid

from django.conf import settings
from django.db import models

from orders.models import Commande
from users.models import Boutique


class Paiement(models.Model):
    class Mode(models.TextChoices):
        MOBILE_MONEY = "mobile_money", "Mobile Money"
        CARTE = "carte", "Carte"
        LIVRAISON = "livraison", "Paiement a la livraison"

    class Status(models.TextChoices):
        INITIE = "initie", "Initie"
        REUSSI = "reussi", "Reussi"
        ECHOUE = "echoue", "Echoue"
        REMBOURSE = "rembourse", "Rembourse"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    commande = models.ForeignKey(Commande, on_delete=models.PROTECT, related_name="paiements")
    mode = models.CharField(max_length=30, choices=Mode.choices)
    reference_externe = models.CharField(max_length=120, unique=True, null=True, blank=True)
    montant = models.DecimalField(max_digits=12, decimal_places=2)
    statut = models.CharField(max_length=20, choices=Status.choices, default=Status.INITIE)
    cree_le = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "paiement"

    def mark_success(self, reference="", payload=None):
        self.statut = self.Status.REUSSI
        self.reference_externe = reference or self.reference_externe
        self.save(update_fields=["statut", "reference_externe"])
        self.commande.statut = Commande.Status.PAYEE
        self.commande.save(update_fields=["statut"])


class PortefeuilleVendeur(models.Model):
    boutique = models.OneToOneField(Boutique, primary_key=True, on_delete=models.CASCADE, related_name="portefeuille")
    solde_disponible = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    solde_en_attente = models.DecimalField(max_digits=14, decimal_places=2, default=0)

    class Meta:
        db_table = "portefeuille_vendeur"


class Reversement(models.Model):
    class Mode(models.TextChoices):
        MOBILE_MONEY = "mobile_money", "Mobile Money"
        BANQUE = "banque", "Banque"

    class Status(models.TextChoices):
        DEMANDE = "demande", "Demande"
        APPROUVE = "approuve", "Approuve"
        REJETE = "rejete", "Rejete"
        PAYE = "paye", "Paye"
        ECHOUE = "echoue", "Echoue"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    boutique = models.ForeignKey(Boutique, on_delete=models.PROTECT, related_name="reversements")
    montant = models.DecimalField(max_digits=14, decimal_places=2)
    mode = models.CharField(max_length=30, choices=Mode.choices)
    compte_destination = models.CharField(max_length=120)
    statut = models.CharField(max_length=20, choices=Status.choices, default=Status.DEMANDE)
    demande_le = models.DateTimeField(auto_now_add=True)
    traite_par = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="reversements_traites",
    )
    traite_le = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "reversement"


class TransactionPortefeuille(models.Model):
    class Type(models.TextChoices):
        CREDIT_VENTE = "credit_vente", "Credit vente"
        DEBIT_REVERSEMENT = "debit_reversement", "Debit reversement"
        DEBIT_REMBOURSEMENT = "debit_remboursement", "Debit remboursement"
        AJUSTEMENT = "ajustement", "Ajustement"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    boutique = models.ForeignKey(Boutique, on_delete=models.PROTECT, related_name="transactions_portefeuille")
    reversement = models.ForeignKey(Reversement, null=True, blank=True, on_delete=models.SET_NULL)
    type = models.CharField(max_length=20, choices=Type.choices)
    montant = models.DecimalField(max_digits=14, decimal_places=2)
    cree_le = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "transaction_portefeuille"


Payment = Paiement
