import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { WebsocketProvider } from 'y-websocket';
import { ThyAction } from 'ngx-tethys/action';
import { AITableGrid, idCreator } from '@ai-table/grid';
import { FormsModule } from '@angular/forms';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyTabs, ThyTab } from 'ngx-tethys/tabs';
import { ThyInputDirective } from 'ngx-tethys/input';
import { TableService, LOCAL_STORAGE_KEY } from '../service/table.service';
import { AITableView, ViewActions } from '@ai-table/state';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyAutofocusDirective, ThyEnterDirective } from 'ngx-tethys/shared';

const initViews = [
    { _id: 'view0', name: '表格视图' },
    { _id: 'view1', name: '表格视图 1' }
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

    room = 'share-demo-action-1';

    router = inject(Router);

    tableService = inject(TableService);

    isEdit = false;

    activeViewName!: string;

    ngOnInit(): void {
        let activeView = localStorage.getItem(`${LOCAL_STORAGE_KEY}`);
        if (!activeView || (activeView && initViews.findIndex((item) => item._id === activeView) < 0)) {
            activeView = initViews[0]._id;
        }
        this.tableService.setActiveView(activeView);
        this.router.navigate([`/${activeView}`]);
        this.tableService.initData(initViews);
    }

    activeTabChange(data: any) {
        this.tableService.setActiveView(data);
        this.router.navigateByUrl(`/${this.tableService.activeViewId()}`);
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
        ViewActions.removeView(this.tableService.aiTable, [this.tableService.activeViewId()]);
    }

    ngOnDestroy(): void {
        this.tableService.disconnect();
    }
}
