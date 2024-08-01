import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AITableGrid } from '@ai-table/grid';

import { CommonComponent } from '../common/common.component';
import { ThyAction } from 'ngx-tethys/action';

@Component({
    selector: 'ai-table-basic',
    standalone: true,
    imports: [RouterOutlet, AITableGrid, CommonComponent, ThyAction],
    templateUrl: './basic.component.html'
})
export class BasicComponent extends CommonComponent {}
