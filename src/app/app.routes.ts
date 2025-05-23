import { Routes } from '@angular/router';
import { DemoTableContent } from './component/common/content/content.component';
import { DemoTable } from './component/table.component';
import { BasicTableExample } from './basic/basic.component';

export const routes: Routes = [
    {
        path: 'basic',
        component: BasicTableExample
    },
    {
        path: '',
        component: DemoTable,
        children: [
            {
                path: ':viewShortId',
                component: DemoTableContent
            }
        ]
    }
];
