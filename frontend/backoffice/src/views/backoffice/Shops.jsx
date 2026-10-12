import { useEffect, useState } from 'react';

import ManagementPage from './ManagementPage';
import { apiGet } from 'services/api';

export default function Shops() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    apiGet('/users/users/')
      .then((rows) => setVendors((Array.isArray(rows) ? rows : rows.results || []).filter((user) => user.role === 'vendeur')))
      .catch(() => setVendors([]));
  }, []);

  return (
    <ManagementPage
      title="Boutiques"
      description="Gestion des vendeurs: boutique, statut de validation et taux de commission."
      endpoint="/users/boutiques/"
      columns={[
        { key: 'nom', label: 'Nom' },
        { key: 'vendeur', label: 'Vendeur' },
        { key: 'statut', label: 'Statut' },
        { key: 'taux_commission', label: 'Commission' },
        { key: 'cree_le', label: 'Creation' }
      ]}
      fields={[
        {
          key: 'vendeur',
          label: 'Vendeur',
          type: 'select',
          required: true,
          options: vendors.map((vendor) => ({ value: vendor.id, label: `${vendor.nom} (${vendor.email})` }))
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
            { value: 'validee', label: 'Validee' },
            { value: 'refusee', label: 'Refusee' },
            { value: 'suspendue', label: 'Suspendue' }
          ]
        },
        { key: 'taux_commission', label: 'Taux commission (%)', type: 'number' }
      ]}
    />
  );
}
