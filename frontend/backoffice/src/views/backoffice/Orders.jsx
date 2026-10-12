import ListPage from './ListPage';

export default function Orders() {
  return (
    <ListPage
      title="Commandes"
      description="Suivi global des commandes clients."
      endpoint="/orders/orders/"
      columns={[
        { key: 'id', label: 'Reference' },
        { key: 'total', label: 'Total' },
        { key: 'frais_livraison', label: 'Livraison' },
        { key: 'statut', label: 'Statut' },
        { key: 'cree_le', label: 'Creation' }
      ]}
    />
  );
}
