import ListPage from './ListPage';

export default function Payments() {
  return (
    <ListPage
      title="Paiements"
      description="Paiements Mobile Money, carte et paiement a la livraison."
      endpoint="/payments/payments/"
      columns={[
        { key: 'commande', label: 'Commande' },
        { key: 'mode', label: 'Mode' },
        { key: 'montant', label: 'Montant' },
        { key: 'statut', label: 'Statut' },
        { key: 'reference_externe', label: 'Reference' }
      ]}
    />
  );
}
