import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const PurchaseList = Loadable(lazy(() => import('./PurchaseList')));
 

const HouseRoutes = [
  {// here
    path: '/purchase-list',
    element: <PurchaseList />,
  }, 
];

export default HouseRoutes;