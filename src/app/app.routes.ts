import { Routes } from '@angular/router';
import { DemoTableContent } from './component/common/content/content.component';
import { DemoTable } from './component/table.component';
import { TableBasicExample } from './examples/basic/basic.component';
import { TableFieldMenuExample } from './examples/field-menu/field-menu.component';

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
        path: 'field-menu',
        component: TableFieldMenuExample
    }
];
