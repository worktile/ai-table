import { Routes } from '@angular/router';
import { BasicComponent } from './component/basic/basic.component';
import { ShareComponent } from './component/share/share.component';
import { TableComponent } from './component/basic/table/table.component';
import { ShareTableComponent } from './component/share/table/table.component';

export const routes: Routes = [
    {
        path: 'share',
        component: ShareComponent,
        children:[
            {
                path: ':viewId',
                component: ShareTableComponent,
            }
        ]
    },
    {
        path: '',
        component: BasicComponent,
        children:[
            {
                path: ':viewId',
                component: TableComponent,
            }
        ]
    },
 
];
