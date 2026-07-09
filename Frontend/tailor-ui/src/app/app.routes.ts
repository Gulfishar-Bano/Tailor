import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { CustomerDashboard } from './features/customer/dashboard/dashboard';
// import { TailorDashboard } from './features/tailor/dashboard/dashboard';
// import { AdminDashboard } from './features/admin/dashboard/dashboard';
import { TailorProfile } from './features/tailor-profile/tailor-profile';
import { TailorList } from './features/customer/tailor-list/tailor-list';
import  {OrderNew } from './features/order-new/order-new';
import { OrderList } from './features/order-list/order-list';
import { CustomerProfile } from './features/profile/profile'; // adjust path if placed elsewhere
import { MeasurementChoiceModal } from './features/measurement-choice-modal/measurement-choice-modal'; // adjust path if placed elsewhere
import {AdminDashboard} from './features/admin/dashboard/dashboard'; 

import { AdminOrderList } from './features/admin/order-list/order-list';
import {TailorDashboard} from './features/tailor/dashboard/dashboard';
import { TailorPortfolio } from './features/tailor/tailor-portfolio/tailor-portfolio';

import { AdminTailorList } from './features/admin/admin-tailor-list/admin-tailor-list'; // adjust path



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

{path: 'customer/order/new',
   component: OrderNew},

{path: 'customer/orders',
   component: OrderList},

{
  path: 'customer/profile',
  component: CustomerProfile,
},
{
  path: 'customer/measurements',
  component: MeasurementChoiceModal,
},

 {
  path: 'admin/dashboard',
  component: AdminDashboard,
},


{
  path: 'admin/orders',
  component: AdminOrderList,
},


{
  path: 'tailor/dashboard',
  component: TailorDashboard,
},
{ path: 'tailor/portfolio',
   component: TailorPortfolio },



{
  path: 'admin/tailors',
  component: AdminTailorList,
},

];