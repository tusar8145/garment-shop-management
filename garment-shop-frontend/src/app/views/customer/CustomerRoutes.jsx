import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const Customer = Loadable(lazy(() => import('./Customer')));
 

const HouseRoutes = [
  {// here
    path: '/customer',
    element: <Customer />,
  }, 
];

export default HouseRoutes;