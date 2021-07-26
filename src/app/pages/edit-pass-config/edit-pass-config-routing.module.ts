import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPassConfigPage } from './edit-pass-config.page';

const routes: Routes = [
    {
        path: '',
        component: EditPassConfigPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EditPassConfigPageRoutingModule { }
