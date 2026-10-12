import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const Dashboard = Loadable(lazy(() => import('views/backoffice/Dashboard')));
const Users = Loadable(lazy(() => import('views/backoffice/Users')));
const Shops = Loadable(lazy(() => import('views/backoffice/Shops')));
const Categories = Loadable(lazy(() => import('views/backoffice/Categories')));
const Products = Loadable(lazy(() => import('views/backoffice/Products')));
const Orders = Loadable(lazy(() => import('views/backoffice/Orders')));
const Payments = Loadable(lazy(() => import('views/backoffice/Payments')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Dashboard />
    },
    {
      path: 'dashboard',
      element: <Dashboard />
    },
    {
      path: 'utilisateurs',
      element: <Users />
    },
    {
      path: 'boutiques',
      element: <Shops />
    },
    {
      path: 'categories',
      element: <Categories />
    },
    {
      path: 'catalogue',
      element: <Products />
    },
    {
      path: 'commandes',
      element: <Orders />
    },
    {
      path: 'paiements',
      element: <Payments />
    }
  ]
};

export default MainRoutes;
