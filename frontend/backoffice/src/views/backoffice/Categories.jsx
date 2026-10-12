import ManagementPage from './ManagementPage';

export default function Categories() {
  return (
    <ManagementPage
      title="Categories"
      description="Gestion des categories du catalogue et des commissions par categorie."
      endpoint="/catalog/categories/"
      columns={[
        { key: 'nom', label: 'Nom' },
        { key: 'slug', label: 'Slug' },
        { key: 'parent', label: 'Parent' },
        { key: 'taux_commission', label: 'Commission' }
      ]}
      getFields={(rows) => [
        {
          key: 'parent',
          label: 'Categorie parente',
          type: 'select',
          options: [
            { value: '', label: 'Aucune' },
            ...rows.map((category) => ({ value: category.id, label: category.nom }))
          ]
        },
        { key: 'nom', label: 'Nom', required: true },
        { key: 'slug', label: 'Slug', required: true },
        { key: 'taux_commission', label: 'Taux commission (%)', type: 'number' }
      ]}
    />
  );
}
