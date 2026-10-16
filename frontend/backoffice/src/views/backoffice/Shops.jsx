import { useEffect, useState } from 'react';

import ManagementPage from './ManagementPage';
import { apiGet } from 'services/api';

export default function Shops() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    // /api/users/  →  liste des utilisateurs (avec pagination éventuelle)
    apiGet('/users/')
      .then((rows) => {
        const list = Array.isArray(rows) ? rows : rows.results || [];
        setVendors(list.filter((user) => user.role === 'vendeur'));
      })
      .catch(() => setVendors([]));
  }, []);

  return (
    <ManagementPage
      title="Boutiques"
      description="Gestion des vendeurs : boutique, statut de validation et taux de commission."
      // Endpoint corrigé : les boutiques sont sous /api/users/boutiques/
      endpoint="/users/boutiques/"
      columns={[
        { key: 'nom', label: 'Nom' },
        {
          key: 'vendeur',
          label: 'Vendeur',
          // vendeur est maintenant un UUID → on affiche vendeur_detail.nom
          render: (row) => row.vendeur_detail?.nom ?? row.vendeur,
        },
        {
          key: 'statut',
          label: 'Statut',
          // utilise le champ *_display fourni par le serializer
          render: (row) => row.statut_display ?? row.statut,
        },
        { key: 'taux_commission', label: 'Commission' },
        {
          key: 'cree_le',
          label: 'Création',
          render: (row) =>
            row.cree_le ? new Date(row.cree_le).toLocaleDateString('fr-FR') : '—',
        },
      ]}
      fields={[
        {
          key: 'vendeur',
          label: 'Vendeur',
          type: 'select',
          required: true,
          // ⚠️ vendeur est en read_only dans le serializer :
          // il est assigné automatiquement depuis request.user côté backend.
          // Si l'admin doit pouvoir choisir, il faut retirer read_only côté DRF.
          options: vendors.map((vendor) => ({
            value: vendor.id,
            label: `${vendor.nom} (${vendor.email || vendor.telephone})`,
          })),
        },
        { key: 'nom', label: 'Nom boutique', required: true },
        { key: 'description', label: 'Description', multiline: true },
        { key: 'logo_url', label: 'Logo URL' },
        {
          key: 'statut',
          label: 'Statut',
          type: 'select',
          required: true,
          defaultValue: 'en_attente',
          options: [
            { value: 'en_attente', label: 'En attente' },
            { value: 'validee', label: 'Validée' },
            { value: 'refusee', label: 'Refusée' },
            { value: 'suspendue', label: 'Suspendue' },
          ],
        },
        {
          key: 'taux_commission',
          label: 'Taux commission (%)',
          type: 'number',
        },
      ]}
    />
  );
}