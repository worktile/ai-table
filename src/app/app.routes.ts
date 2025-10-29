import { Routes } from '@angular/router';
import { DemoTableContent } from './component/common/content/content.component';
import { DemoTable } from './component/table.component';
import { TableBasicExample } from './examples/basic/basic.component';
import { TableViewExample } from './examples/view/view.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'overall',
        pathMatch: 'full'
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
    },
    {
        path: 'basic',
        component: TableBasicExample
    },
    {
        path: 'view',
        component: TableViewExample
    }
];
