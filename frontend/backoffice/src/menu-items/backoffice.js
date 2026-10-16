import {
  IconBuildingStore,
  IconCategory,
  IconCreditCard,
  IconDashboard,
  IconPackage,
  IconReceipt,
  IconUsers
} from '@tabler/icons-react';

const icons = {
  IconBuildingStore,
  IconCategory,
  IconCreditCard,
  IconDashboard,
  IconPackage,
  IconReceipt,
  IconUsers
};

const backoffice = {
  id: 'backoffice',
  title: 'Backoffice',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Tableau de bord',
      type: 'item',
      url: '/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'users',
      title: 'Utilisateurs',
      type: 'item',
      url: '/utilisateurs',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'shops',
      title: 'Boutiques',
      type: 'item',
      url: '/boutiques',
      icon: icons.IconBuildingStore,
      breadcrumbs: false
    },
    {
      id: 'categories',
      title: 'Categories',
      type: 'item',
      url: '/categories',
      icon: icons.IconCategory,
      breadcrumbs: false
    },
    {
      id: 'products',
      title: 'Catalogue',
      type: 'item',
      url: '/catalogue',
      icon: icons.IconPackage,
      breadcrumbs: false
    },
    {
      id: 'orders',
      title: 'Commandes',
      type: 'item',
      url: '/commandes',
      icon: icons.IconReceipt,
      breadcrumbs: false
    },
    {
      id: 'payments',
      title: 'Paiements',
      type: 'item',
      url: '/paiements',
      icon: icons.IconCreditCard,
      breadcrumbs: false
    }
  ]
};

export default backoffice;
