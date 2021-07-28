import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PasswordTabPage } from './password-tab.page';

const routes: Routes = [
    {
        path: '',
        component: PasswordTabPage,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PasswordTabPageRoutingModule { }
