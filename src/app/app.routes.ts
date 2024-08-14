import { Routes } from '@angular/router';
import { DemoCanvas } from './component/canvas/canvas.component';

export const routes: Routes = [
    // {
    //     path: '',
    //     component: DemoTable,
    //     children: [
    //         {
    //             path: ':viewId',
    //             component: DemoTableContent
    //         }
    //     ]
    // },
    {
        path: '',
        component: DemoCanvas
    }
];
