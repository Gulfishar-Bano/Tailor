import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { CustomerDashboard } from './features/customer/dashboard/dashboard';
// import { TailorDashboard } from './features/tailor/dashboard/dashboard';
// import { AdminDashboard } from './features/admin/dashboard/dashboard';
import { TailorProfile } from './features/customer/tailor-profile/tailor-profile';
import { TailorList } from './features/customer/tailor-list/tailor-list';
import { OrderNew } from './features/order-new/order-new';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
  path: 'customer/dashboard',
  component: CustomerDashboard,
},
// {
//   path: 'tailor/dashboard',
//   component: TailorDashboard,
// },
// {
//   path: 'admin/dashboard',
//   component: AdminDashboard,
// },

{
  path: 'customer/dashboard',
  component: CustomerDashboard,
},
{
  path: 'customer/tailors',
  component: TailorList,
},
{
  path: 'customer/tailor/:id',
  component: TailorProfile,
},

{path: 'customer/order/new', component: OrderNew},
];