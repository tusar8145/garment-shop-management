import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const PurchaseList = Loadable(lazy(() => import('./OrderList')));
 

const HouseRoutes = [
  {// here
    path: '/order-list',
    element: <PurchaseList />,
  }, 
];

export default HouseRoutes; 