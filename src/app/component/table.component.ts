import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { WebsocketProvider } from 'y-websocket';
import { ThyAction } from 'ngx-tethys/action';
import { AITableGrid, idCreator } from '@ai-table/grid';
import { FormsModule } from '@angular/forms';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyTabs, ThyTab } from 'ngx-tethys/tabs';
import { ThyInputDirective } from 'ngx-tethys/input';
import { TableService } from '../service/table.service';
import { AITableView, ViewActions } from '@ai-table/shared';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyAutofocusDirective, ThyEnterDirective } from 'ngx-tethys/shared';

const initViews = [
    { _id: 'view1', name: '表格视图 ', is_active: true },
    { _id: 'view2', name: '表格视图 1' }
];

@Component({
    selector: 'demo-ai-table',
    standalone: true,
    imports: [
        RouterOutlet,
        AITableGrid,
        ThyAction,
        ThyTabs,
        ThyTab,
        ThyPopoverModule,
        FormsModule,
        ThyInputDirective,
        ThyIconModule,
        ThyAction,
        ThyDropdownModule,
        ThyEnterDirective,
        ThyAutofocusDirective
    ],
    templateUrl: './table.component.html',
    providers: [TableService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoTable implements OnInit, OnDestroy {
    provider!: WebsocketProvider | null;

    room = 'share-room-demo-action-1';

    router = inject(Router);

    tableService = inject(TableService);

    isEdit = false;

    activeViewName!: string;

    ngOnInit(): void {
        this.router.navigate(['/view1']);
        this.tableService.initData(initViews);
    }

    activeTabChange(data: any) {
        this.tableService.updateActiveView(data);
        this.router.navigateByUrl(`/${this.tableService.activeView()._id}`);
    }

    handleShared() {
        this.tableService.handleShared(this.room);
    }

    updateValue() {
        this.isEdit = false;
        if (this.activeViewName !== this.tableService.activeView().name) {
            ViewActions.setView(this.tableService.aiTable, { name: this.activeViewName }, [this.tableService.activeView()._id]);
        }
    }

    updateEditStatus() {
        this.isEdit = true;
    }

    nameChange(value: string) {
        this.activeViewName = value;
    }

    addView() {
        const index = this.tableService.views().length;
        const newView: AITableView = {
            _id: idCreator(),
            name: '表格视图 ' + index
        };
        ViewActions.addView(this.tableService.aiTable, newView, [index]);
    }

    removeView() {
        ViewActions.removeView(this.tableService.aiTable, [this.tableService.activeView()._id]);
    }

    ngOnDestroy(): void {
        this.tableService.disconnect();
    }
}
