import { Routes } from '@angular/router';
import { DemoTableContent } from './component/common/content/content.component';
import { DemoTable } from './component/table.component';
import { DemoCanvasTableContent } from './component/common/canvas/content.component';

export const routes: Routes = [
    {
        path: '',
        component: DemoTable,
        children: [
            {
                path: 'canvas',
                component: DemoCanvasTableContent
            },
            {
                path: ':viewId',
                component: DemoTableContent
            }
        ]
    }
];
