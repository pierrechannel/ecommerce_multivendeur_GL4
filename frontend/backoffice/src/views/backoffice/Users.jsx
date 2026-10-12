import ManagementPage from './ManagementPage';

export default function Users() {
  return (
    <ManagementPage
      title="Utilisateurs"
      description="Ajout, modification et suppression des comptes client, vendeur et administrateur."
      endpoint="/users/users/"
      columns={[
        { key: 'nom', label: 'Nom' },
        { key: 'email', label: 'Email' },
        { key: 'telephone', label: 'Telephone' },
        { key: 'role', label: 'Role' },
        { key: 'statut', label: 'Statut' }
      ]}
      fields={[
        { key: 'nom', label: 'Nom', required: true },
        { key: 'email', label: 'Email', type: 'email', required: true },
        { key: 'telephone', label: 'Telephone' },
        {
          key: 'role',
          label: 'Role',
          type: 'select',
          required: true,
          defaultValue: 'client',
          options: [
            { value: 'client', label: 'Client' },
            { value: 'vendeur', label: 'Vendeur' },
            { value: 'admin', label: 'Administrateur' }
          ]
        },
        {
          key: 'statut',
          label: 'Statut',
          type: 'select',
          required: true,
          defaultValue: 'actif',
          options: [
            { value: 'actif', label: 'Actif' },
            { value: 'suspendu', label: 'Suspendu' }
          ]
        },
        { key: 'password', label: 'Mot de passe', type: 'password', createOnly: true, required: true }
      ]}
    />
  );
}
