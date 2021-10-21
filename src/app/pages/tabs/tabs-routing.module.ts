import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: '',
                redirectTo: '/tabs/safe-tab',
                pathMatch: 'full'
            },
            {
                path: 'safe-tab',
                loadChildren: () => import('../list-tab/list-tab.module').then(m => m.ListTabPageModule)
            },
            {
                path: 'password-tab',
                loadChildren: () => import('../password-tab/password-tab.module').then(m => m.PasswordTabPageModule)
            },
            {
              path: 'password-tab/create',
              loadChildren: () => import('../password-tab/password-tab.module').then(m => m.PasswordTabPageModule)
            },
            {
              path: 'password-tab/create/:page',
              loadChildren: () => import('../password-tab/password-tab.module').then(m => m.PasswordTabPageModule)
            },
            {
              path: 'password-tab/create/:secret',
              loadChildren: () => import('../password-tab/password-tab.module').then(m => m.PasswordTabPageModule)
            },
            {
              path: 'password-tab/create/:page/:secret',
              loadChildren: () => import('../password-tab/password-tab.module').then(m => m.PasswordTabPageModule)
            },
            {
                path: 'group-tab',
                loadChildren: () => import('../group-tab/group-tab.module').then(m => m.GroupTabPageModule)
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/safe-tab',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
