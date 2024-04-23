import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const Purchase = Loadable(lazy(() => import('./Purchase')));
 

const HouseRoutes = [
  {// here
    path: '/purchase-create',
    element: <Purchase />,
  }, 
];

export default HouseRoutes;