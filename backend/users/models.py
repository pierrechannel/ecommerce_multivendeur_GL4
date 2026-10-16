import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UtilisateurManager(BaseUserManager):
    def create_user(self, email=None, telephone=None, password=None, **extra_fields):
        if not email and not telephone:
            raise ValueError("Un email ou un telephone est obligatoire.")
        if email:
            email = self.normalize_email(email)
        user = self.model(email=email, telephone=telephone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("nom", "Administrateur")
        extra_fields.setdefault("role", Utilisateur.Role.ADMIN)
        extra_fields.setdefault("statut", Utilisateur.Statut.ACTIF)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email=email, password=password, **extra_fields)


class Utilisateur(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        CLIENT = "client", "Client"
        VENDEUR = "vendeur", "Vendeur"
        ADMIN = "admin", "Backoffice"

    class Statut(models.TextChoices):
        ACTIF = "actif", "Actif"
        SUSPENDU = "suspendu", "Suspendu"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=120)
    email = models.EmailField(max_length=160, unique=True, null=True, blank=True)
    telephone = models.CharField(max_length=30, unique=True, null=True, blank=True)
    password = models.TextField(db_column="mot_de_passe_hash")
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CLIENT)
    statut = models.CharField(max_length=20, choices=Statut.choices, default=Statut.ACTIF)
    cree_le = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UtilisateurManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nom"]

    class Meta:
        db_table = "utilisateur"

    def __str__(self):
        return self.nom

    @property
    def is_vendor(self):
        return self.role == self.Role.VENDEUR

    @property
    def username(self):
        return self.email or self.telephone or str(self.id)


class Adresse(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name="adresses")
    libelle = models.CharField(max_length=60, blank=True)
    ville = models.CharField(max_length=80)
    quartier = models.CharField(max_length=80, blank=True)
    rue = models.CharField(max_length=160, blank=True)
    telephone = models.CharField(max_length=30, blank=True)
    par_defaut = models.BooleanField(default=False)

    class Meta:
        db_table = "adresse"

    def __str__(self):
        return f"{self.ville} - {self.libelle or self.quartier}"


class Boutique(models.Model):
    class Statut(models.TextChoices):
        EN_ATTENTE = "en_attente", "En attente"
        VALIDEE = "validee", "Validee"
        REFUSEE = "refusee", "Refusee"
        SUSPENDUE = "suspendue", "Suspendue"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vendeur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, related_name="boutique")
    nom = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    logo_url = models.TextField(blank=True)
    statut = models.CharField(max_length=20, choices=Statut.choices, default=Statut.EN_ATTENTE)
    taux_commission = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    cree_le = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "boutique"

    def __str__(self):
        return self.nom
