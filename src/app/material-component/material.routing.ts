import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouteGuardService } from '../services/route-guard.service';
import { ManageProductComponent } from './manage-product/manage-product.component';


export const MaterialRoutes: Routes = [
    {
        path: 'product',
        component: ManageProductComponent,
        canActivate: [RouteGuardService],
        data:{
            expectedRole: ['admin']
        }

    }
];
