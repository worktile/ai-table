import { Routes } from '@angular/router';
import { BasicComponent } from './component/basic/basic.component';
import { ShareComponent } from './component/share/share.component';

export const routes: Routes = [
    {
        path: '',
        component: BasicComponent
    },
    {
        path: 'share',
        component: ShareComponent
    },
];
