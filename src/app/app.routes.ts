import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    pathMatch:'full',
    redirectTo:'transacciones'

},
{
    path: 'transacciones',
    // component:TransaccionesComponent,
    loadComponent:()=>import('@pages/transacciones/transacciones.component').then(c=>c.TransaccionesComponent)
}
];
