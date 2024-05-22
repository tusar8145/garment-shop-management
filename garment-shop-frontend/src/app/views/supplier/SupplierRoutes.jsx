import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const Supplier = Loadable(lazy(() => import('./Supplier')));
 

const HouseRoutes = [
  {// here
    path: '/supplier',
    element: <Supplier />,
  }, 
];

export default HouseRoutes;