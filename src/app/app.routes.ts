import { Routes } from '@angular/router';
import { DemoCanvas } from './component/canvas/canvas.component';
import { DemoTableContent } from './component/common/content/content.component';
import { DemoTable } from './component/table.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'table',
        pathMatch: 'full'
    },
    {
        path: 'table',
        component: DemoTable,
        children: [
            {
                path: ':viewId',
                component: DemoTableContent
            }
        ]
    },
    {
        path: 'canvas',
        component: DemoCanvas
    }
];
