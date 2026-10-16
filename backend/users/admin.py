from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Adresse, Boutique, Utilisateur


@admin.register(Utilisateur)
class CustomUserAdmin(UserAdmin):
    model = Utilisateur
    fieldsets = (
        (None, {"fields": ("email", "telephone", "password")}),
        ("Profil", {"fields": ("nom", "role", "statut")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates", {"fields": ("last_login", "cree_le")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("nom", "email", "telephone", "role", "password1", "password2")}),
    )
    list_display = ["nom", "email", "telephone", "role", "statut", "is_active", "is_staff"]
    list_filter = ["role", "statut", "is_active", "is_staff"]
    search_fields = ["nom", "email", "telephone"]
    ordering = ["nom"]
    readonly_fields = ["cree_le"]


@admin.register(Adresse)
class AdresseAdmin(admin.ModelAdmin):
    list_display = ["utilisateur", "ville", "quartier", "par_defaut"]
    list_filter = ["ville", "par_defaut"]


@admin.register(Boutique)
class BoutiqueAdmin(admin.ModelAdmin):
    list_display = ["nom", "vendeur", "statut", "taux_commission", "cree_le"]
    list_filter = ["statut"]
