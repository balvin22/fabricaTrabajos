import { Routes } from '@angular/router';
import { LoginComponent } from '@pages/login/login.component';

export const routes: Routes = [{
    path: '',
    pathMatch:'full',
    redirectTo:'transacciones'

},
{
    path: 'transacciones',
    // component:TransaccionesComponent,
    loadComponent:()=>import('@pages/transacciones/transacciones.component').then(c=>c.TransaccionesComponent)
},
{
    path: 'login',
    // component:LoginComponent,
    loadComponent:()=>import('@pages/login/login.component').then(c=>LoginComponent)
}


];
