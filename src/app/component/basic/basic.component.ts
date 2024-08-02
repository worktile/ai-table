import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AITableGrid } from '@ai-table/grid';
import { ThyAction } from 'ngx-tethys/action';
import { ThyTabs, ThyTab } from 'ngx-tethys/tabs';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { TableService } from '../../service/table.service';

const initViews = [
    { id: 'view1', name: '表格视图1', isActive: true },
    { id: 'view2', name: '表格视图2' }
];

@Component({
    selector: 'ai-table-basic',
    standalone: true,
    imports: [RouterOutlet, AITableGrid, ThyAction, ThyTabs, ThyTab, ThyPopoverModule],
    templateUrl: './basic.component.html',
    providers: [TableService]
})
export class BasicComponent implements OnInit {
    router = inject(Router);

    tableService = inject(TableService);

    ngOnInit(): void {
        this.tableService.initViews(initViews);
        this.router.navigate(['/view1']);
    }

    activeTabChange(data: any) {
        this.tableService.updateActiveView(data);
        this.router.navigateByUrl(`/${this.tableService.activeView().id}`);
    }
}
