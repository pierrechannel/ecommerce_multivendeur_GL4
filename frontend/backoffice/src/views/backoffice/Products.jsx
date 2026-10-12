import ListPage from './ListPage';

export default function Products() {
  return (
    <ListPage
      title="Catalogue"
      description="Produits publies par les vendeurs."
      endpoint="/catalog/products/"
      columns={[
        { key: 'titre', label: 'Produit' },
        { key: 'boutique_nom', label: 'Boutique' },
        { key: 'prix_base', label: 'Prix' },
        { key: 'stock', label: 'Stock' },
        { key: 'statut', label: 'Statut' }
      ]}
    />
  );
}
