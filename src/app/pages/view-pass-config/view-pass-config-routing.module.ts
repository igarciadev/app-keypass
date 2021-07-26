import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPassConfigPage } from './view-pass-config.page';

const routes: Routes = [
    {
        path: '',
        component: ViewPassConfigPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewPassConfigPageRoutingModule { }
