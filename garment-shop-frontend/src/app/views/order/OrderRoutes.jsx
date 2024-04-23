import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const Purchase = Loadable(lazy(() => import('./Order')));
 

const HouseRoutes = [
  {// here
    path: '/order-create',
    element: <Purchase />,
  }, 
];

export default HouseRoutes;