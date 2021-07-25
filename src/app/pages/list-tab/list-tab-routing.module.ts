import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListTabPage } from './list-tab.page';

const routes: Routes = [
    {
        path: '',
        component: ListTabPage,
    },
    {
        path: 'search',
        loadChildren: () => import('../search/search.module').then(m => m.SearchPageModule)
    },
    {
        path: 'create',
        loadChildren: () => import('../create-pass-config/create-pass-config.module').then(m => m.CreatePassConfigPageModule)
    },
    {
        path: 'edit',
        loadChildren: () => import('../edit-pass-config/edit-pass-config.module').then(m => m.EditPassConfigPageModule)
    },
    {
        path: 'edit/:secret',
        loadChildren: () => import('../edit-pass-config/edit-pass-config.module').then(m => m.EditPassConfigPageModule)
    },
    {
        path: 'view',
        loadChildren: () => import('../view-pass-config/view-pass-config.module').then(m => m.ViewPassConfigPageModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListTabPageRoutingModule { }
