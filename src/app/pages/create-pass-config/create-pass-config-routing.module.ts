import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePassConfigPage } from './create-pass-config.page';

const routes: Routes = [
    {
        path: '',
        component: CreatePassConfigPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CreatePassConfigPageRoutingModule { }
