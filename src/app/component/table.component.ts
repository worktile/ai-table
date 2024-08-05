import { Component, OnDestroy, OnInit, WritableSignal, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { WebsocketProvider } from 'y-websocket';
import { ThyAction } from 'ngx-tethys/action';
import { AITableGrid } from '@ai-table/grid';
import { FormsModule } from '@angular/forms';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyTabs, ThyTab } from 'ngx-tethys/tabs';
import { ThyInputDirective } from 'ngx-tethys/input';
import { TableService } from '../service/table.service';

const initViews = [
    { id: 'view1', name: '表格视图1', isActive: true },
    { id: 'view2', name: '表格视图2' }
];

@Component({
    selector: 'demo-ai-table',
    standalone: true,
    imports: [RouterOutlet, AITableGrid, ThyAction, ThyTabs, ThyTab, ThyPopoverModule, FormsModule, ThyInputDirective],
    templateUrl: './table.component.html',
    providers: [TableService]
})
export class DemoTable implements OnInit, OnDestroy {
    provider!: WebsocketProvider | null;

    room = 'share-room-2';

    router = inject(Router);

    tableService = inject(TableService);

    ngOnInit(): void {
        this.router.navigate(['/view1']);
        this.tableService.initData(initViews);
    }

    activeTabChange(data: any) {
        this.tableService.updateActiveView(data);
        this.router.navigateByUrl(`/${this.tableService.activeView().id}`);
    }

    handleShared() {
        this.tableService.handleShared(this.room);
    }

    ngOnDestroy(): void {
        this.tableService.disconnect();
    }
}
