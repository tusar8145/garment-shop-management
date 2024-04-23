import AuthGuard from 'app/auth/AuthGuard';
import dashboardRoutes from 'app/views/dashboard/DashboardRoutes';
import NotFound from 'app/views/sessions/NotFound';
import sessionRoutes from 'app/views/sessions/SessionRoutes';
import { Navigate } from 'react-router-dom';
import MatxLayout from './components/MatxLayout/MatxLayout';
 
import purchaseRoutes from 'app/views/purchase/PurchaseRoutes'; 
import purchaseListRoutes from 'app/views/purchase-list/PurchaseListRoutes'; 
import orderRoutes from 'app/views/order/OrderRoutes'; 
import orderListRoutes from 'app/views/order-list/OrderListRoutes'; 
const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [ ...orderRoutes, ...orderListRoutes, ...dashboardRoutes,   ...purchaseRoutes,   ...purchaseListRoutes,],
  },
  ...sessionRoutes,
  { path: '/', element: <Navigate to="dashboard/default" /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
 