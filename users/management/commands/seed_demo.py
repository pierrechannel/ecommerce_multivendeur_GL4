from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from catalog.models import Category, Product
from orders.models import Commande, LigneCommande, LignePanier, Panier, reserve_stock
from payments.models import Paiement, PortefeuilleVendeur, Reversement, TransactionPortefeuille
from users.models import Adresse, Boutique, Utilisateur


class Command(BaseCommand):
    help = "Seed demo data for the multi-vendor e-commerce MVP."

    def add_arguments(self, parser):
        parser.add_argument("--password", default="Admin12345", help="Password used for demo accounts.")

    @transaction.atomic
    def handle(self, *args, **options):
        password = options["password"]

        admin = self.ensure_user(
            email="admin@mvmarket.test",
            nom="Administrateur MV Market",
            role=Utilisateur.Role.ADMIN,
            password=password,
            is_staff=True,
            is_superuser=True,
        )

        client = self.ensure_user(
            email="client@mvmarket.test",
            nom="Client Demo",
            telephone="+25761000001",
            role=Utilisateur.Role.CLIENT,
            password=password,
        )

        vendor_users = [
            self.ensure_user(
                email="vendeur.mode@mvmarket.test",
                nom="Aline Mode",
                telephone="+25761000011",
                role=Utilisateur.Role.VENDEUR,
                password=password,
            ),
            self.ensure_user(
                email="vendeur.tech@mvmarket.test",
                nom="Eric Tech",
                telephone="+25761000012",
                role=Utilisateur.Role.VENDEUR,
                password=password,
            ),
        ]

        Adresse.objects.update_or_create(
            utilisateur=client,
            libelle="Maison",
            defaults={
                "ville": "Bujumbura",
                "quartier": "Kinindo",
                "rue": "Avenue du Large",
                "telephone": "+25761000001",
                "par_defaut": True,
            },
        )

        shops = [
            self.ensure_shop(vendor_users[0], "Mode Express", "Vetements et accessoires locaux.", Decimal("8.00")),
            self.ensure_shop(vendor_users[1], "Tech Burundi", "Telephones, accessoires et gadgets.", Decimal("10.00")),
        ]

        categories = {
            "mode": self.ensure_category("Mode", "mode", Decimal("8.00")),
            "electronique": self.ensure_category("Electronique", "electronique", Decimal("10.00")),
            "maison": self.ensure_category("Maison", "maison", Decimal("7.50")),
        }

        products = [
            self.ensure_product(
                boutique=shops[0],
                categorie=categories["mode"],
                titre="T-shirt coton MV",
                prix_base=Decimal("35000.00"),
                stock=35,
                image_url="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
            ),
            self.ensure_product(
                boutique=shops[0],
                categorie=categories["mode"],
                titre="Sac urbain vendeur",
                prix_base=Decimal("78000.00"),
                stock=18,
                image_url="https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
            ),
            self.ensure_product(
                boutique=shops[1],
                categorie=categories["electronique"],
                titre="Ecouteurs Bluetooth",
                prix_base=Decimal("95000.00"),
                stock=22,
                image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            ),
            self.ensure_product(
                boutique=shops[1],
                categorie=categories["electronique"],
                titre="Chargeur rapide USB-C",
                prix_base=Decimal("42000.00"),
                stock=40,
                image_url="https://images.unsplash.com/photo-1583863788434-e58a36330cf0",
            ),
        ]

        panier, _ = Panier.objects.get_or_create(client=client)
        LignePanier.objects.update_or_create(panier=panier, produit=products[0], defaults={"quantite": 1})
        LignePanier.objects.update_or_create(panier=panier, produit=products[2], defaults={"quantite": 2})

        adresse = client.adresses.filter(par_defaut=True).first()
        commande = self.ensure_order(client, adresse, products)
        paiement = self.ensure_payment(commande)

        for shop in shops:
            PortefeuilleVendeur.objects.update_or_create(
                boutique=shop,
                defaults={"solde_disponible": Decimal("150000.00"), "solde_en_attente": Decimal("45000.00")},
            )

        TransactionPortefeuille.objects.get_or_create(
            boutique=shops[0],
            type=TransactionPortefeuille.Type.CREDIT_VENTE,
            montant=Decimal("35000.00"),
        )
        Reversement.objects.get_or_create(
            boutique=shops[0],
            montant=Decimal("50000.00"),
            mode=Reversement.Mode.MOBILE_MONEY,
            compte_destination="+25761000011",
            defaults={"statut": Reversement.Status.DEMANDE},
        )

        self.stdout.write(self.style.SUCCESS("Demo data created/updated."))
        self.stdout.write(f"Backoffice admin: {admin.email} / {password}")
        self.stdout.write(f"Demo client: {client.email} / {password}")
        self.stdout.write(f"Demo payment: {paiement.reference_externe}")

    def ensure_user(self, email, nom, role, password, telephone=None, **flags):
        user, created = Utilisateur.objects.get_or_create(
            email=email,
            defaults={
                "nom": nom,
                "telephone": telephone,
                "role": role,
                "statut": Utilisateur.Statut.ACTIF,
                **flags,
            },
        )
        if not created:
            user.nom = nom
            user.role = role
            user.statut = Utilisateur.Statut.ACTIF
            for key, value in flags.items():
                setattr(user, key, value)
            if telephone and not user.telephone:
                user.telephone = telephone
        user.set_password(password)
        user.save()
        return user

    def ensure_shop(self, vendeur, nom, description, taux_commission):
        shop, _ = Boutique.objects.update_or_create(
            vendeur=vendeur,
            defaults={
                "nom": nom,
                "description": description,
                "statut": Boutique.Statut.VALIDEE,
                "taux_commission": taux_commission,
            },
        )
        return shop

    def ensure_category(self, nom, slug, taux_commission):
        category, _ = Category.objects.update_or_create(
            slug=slug,
            defaults={"nom": nom, "taux_commission": taux_commission},
        )
        return category

    def ensure_product(self, boutique, categorie, titre, prix_base, stock, image_url):
        product, _ = Product.objects.update_or_create(
            boutique=boutique,
            titre=titre,
            defaults={
                "categorie": categorie,
                "description": f"{titre} disponible sur MV Market.",
                "prix_base": prix_base,
                "image_url": image_url,
                "stock": stock,
                "seuil_alerte": 5,
                "statut": Product.Statut.ACTIF,
            },
        )
        return product

    def ensure_order(self, client, adresse, products):
        commande = Commande.objects.filter(client=client).first()
        if commande:
            return commande

        commande = Commande.objects.create(
            client=client,
            adresse_livraison=adresse,
            frais_livraison=Decimal("5000.00"),
            statut=Commande.Status.PAYEE,
        )
        for product, quantity in [(products[0], 1), (products[2], 2)]:
            LigneCommande.objects.create(
                commande=commande,
                produit=product,
                boutique=product.boutique,
                titre_snapshot=product.titre,
                prix_unitaire=product.prix_base,
                quantite=quantity,
            )
        reserve_stock(commande)
        commande.recalculate_total()
        return commande

    def ensure_payment(self, commande):
        payment, _ = Paiement.objects.update_or_create(
            commande=commande,
            reference_externe="MM-DEMO-0001",
            defaults={
                "mode": Paiement.Mode.MOBILE_MONEY,
                "montant": commande.total,
                "statut": Paiement.Status.REUSSI,
            },
        )
        return payment
