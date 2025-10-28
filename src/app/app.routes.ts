import { Routes } from '@angular/router';
import { DemoTableContent } from './component/common/content/content.component';
import { DemoTable } from './component/table.component';
import { BasicTableExample } from './examples/basic/basic.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'overall',
        pathMatch: 'full'
    },
    {
        path: 'basic',
        component: BasicTableExample
    },
    {
        path: 'overall',
        component: DemoTable,
        children: [
            {
                path: ':viewShortId',
                component: DemoTableContent
            }
        ]
    }
];
