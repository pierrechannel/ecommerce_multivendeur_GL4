# E-Commerce Multi-Vendeurs Backend

Django/DRF MVP backend following the requested structure:

- `users`: Auth service with JWT-ready custom users and roles.
- `catalog`: Catalog service for categories and products. Product image and stock are stored directly on `produit`.
- `orders`: Order service with cart, order, and order-line entities.
- `payments`: Payment service for Mobile Money payment initiation and webhooks.
- `notifications`: Notification service for FCM/SMS placeholders.
- `config`: Project settings, routing, and API composition.

This is intentionally a modular monolith for the MVP. Each Django app maps to a future microservice boundary, so the project can be split later without starting over.

Simplified MVP tables intentionally ignored: `variante`, `image_produit`, `favori`, `sous_commande`, `avis`, and `litige`.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Demo Data

```bash
python manage.py seed_demo
```

Default demo credentials:

- Backoffice admin: `admin@mvmarket.test` / `Admin12345`
- Demo client: `client@mvmarket.test` / `Admin12345`

## MySQL

Create the database before running migrations:

```sql
CREATE DATABASE ecommerce_multivendeur
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Then update `.env` with your MySQL username and password.

## Backoffice React

The web backoffice uses the Berry React admin template in `frontend/backoffice`.
It is reserved for administration. Client and vendor spaces are planned for mobile apps.

```bash
cd frontend/backoffice
npm install
npm run dev
```

The backoffice reads the Django API URL from `frontend/backoffice/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Main API Routes

- `POST /api/auth/token/`: obtain JWT tokens.
- `POST /api/auth/token/refresh/`: refresh JWT token.
- `GET /api/users/me/`: current user profile.
- `GET /api/catalog/categories/`: categories.
- `GET /api/catalog/products/`: searchable/filterable products.
- `POST /api/orders/orders/`: create an order from order items.
- `POST /api/payments/payments/initiate/`: initiate Mobile Money payment.
- `POST /api/payments/webhooks/mobile-money/`: receive payment webhook.
- `POST /api/notifications/`: create notification records.

