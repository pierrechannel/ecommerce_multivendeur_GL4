from rest_framework import serializers

from .models import Adresse, Boutique, Utilisateur


class AdresseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adresse
        fields = ["id", "libelle", "ville", "quartier", "rue", "telephone", "par_defaut"]


class BoutiqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Boutique
        fields = ["id", "vendeur", "nom", "description", "logo_url", "statut", "taux_commission", "cree_le"]
        read_only_fields = ["cree_le"]


class UserSerializer(serializers.ModelSerializer):
    adresses = AdresseSerializer(many=True, read_only=True)
    boutique = BoutiqueSerializer(read_only=True)

    class Meta:
        model = Utilisateur
        fields = ["id", "nom", "email", "telephone", "role", "statut", "cree_le", "adresses", "boutique"]
        read_only_fields = ["id"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Utilisateur
        fields = ["id", "nom", "email", "telephone", "password", "role", "statut"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = Utilisateur(**validated_data)
        if user.role == Utilisateur.Role.ADMIN:
            user.is_staff = True
        user.set_password(password)
        user.save()
        return user
