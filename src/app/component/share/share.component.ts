import { Component, OnDestroy, OnInit, WritableSignal, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { WebsocketProvider } from 'y-websocket';
import { ThyAction } from 'ngx-tethys/action';
import { AITableGrid } from '@ai-table/grid';
import { FormsModule } from '@angular/forms';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyTabs, ThyTab } from 'ngx-tethys/tabs';
import { DemoAIRecord, DemoAIField } from '../../types';
import { ThyInputDirective } from 'ngx-tethys/input';
import { getDefaultValue } from '../../utils/utils';
import { TableService } from '../../service/table.service';

const initViews = [
    { id: 'view1', name: '表格视图1', isActive: true },
    { id: 'view2', name: '表格视图2' }
];

@Component({
    selector: 'ai-table-share',
    standalone: true,
    imports: [RouterOutlet, AITableGrid, ThyAction, ThyTabs, ThyTab, ThyPopoverModule, FormsModule, ThyInputDirective],
    templateUrl: './share.component.html',
    providers: [TableService]
})
export class ShareComponent implements OnInit, OnDestroy {
    provider!: WebsocketProvider | null;

    room = 'share-room-1';

    records!: WritableSignal<DemoAIRecord[]>;

    fields!: WritableSignal<DemoAIField[]>;

    router = inject(Router);

    tableService = inject(TableService);

    ngOnInit(): void {
        this.router.navigate(['/share/view1']);
        this.tableService.initViews(initViews);
        const value = getDefaultValue();
        this.tableService.initRecordsAndFields(value.records, value.fields);
    }

    activeTabChange(data: any) {
        this.tableService.updateActiveView(data);
        this.router.navigateByUrl(`/share/${this.tableService.activeView().id}`);
    }

    handleShared() {
        this.tableService.handleShared(this.room);
    }

    ngOnDestroy(): void {
        this.tableService.disconnect();
    }
}
