import { Actions, addView, removeView } from '@ai-table/state';
import { AITableView, AITableViewFields, AITableViewRecords, SortDirection } from '@ai-table/utils';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ThyAction } from 'ngx-tethys/action';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyInputDirective } from 'ngx-tethys/input';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyAutofocusDirective, ThyEnterDirective } from 'ngx-tethys/shared';
import { ThyTab, ThyTabs } from 'ngx-tethys/tabs';
import { WebsocketProvider } from 'y-websocket';
import { LOCAL_STORAGE_KEY, TableService } from '../service/table.service';

const initViews: AITableView[] = [
    {
        _id: 'view1',
        short_id: 'view-short-id-1',
        name: '表格视图',
        position: 0,
        settings: {
            frozen_field_id: 'column-110'
        }
    },
    { _id: 'view2', short_id: 'view-short-id-2', name: '表格视图 2', position: 1 }
];

@Component({
    selector: 'demo-ai-table',
    imports: [
        RouterOutlet,
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-block w-100 h-100'
    }
})
export class DemoTable implements OnInit, AfterViewInit, OnDestroy {
    provider!: WebsocketProvider | null;

    room = 'share-demo-action-1';

    router = inject(Router);

    activatedRoute = inject(ActivatedRoute);

    tableService = inject(TableService);

    isEdit = false;

    readonly = false;

    hiddenIndexColumn = false;

    hiddenRowDrag = false;

    group = false;

    activeViewName!: string;

    maxRecords = 500;

    maxFields = 500;

    ngOnInit(): void {
        let activeViewId = localStorage.getItem(`${LOCAL_STORAGE_KEY}`);
        if (!activeViewId || (activeViewId && initViews.findIndex((item) => item._id === activeViewId) < 0)) {
            activeViewId = initViews[0]._id;
        }
        this.tableService.setActiveView(activeViewId);
        this.tableService.initData(initViews);
        if (!this.activatedRoute.firstChild) {
            this.router.navigateByUrl(`/${this.tableService.activeViewShortId()}`);
        }
    }

    ngAfterViewInit(): void {}

    activeTabChange(data: any) {
        this.tableService.setActiveView(data);
        this.router.navigateByUrl(`/${this.tableService.activeViewShortId()}`);
    }

    handleShared() {
        this.tableService.handleShared(this.room);
    }

    handleReadonlyChange(e: any) {
        this.readonly = e.target.checked;
        this.tableService.setReadonly(e.target.checked);
    }

    handleHiddenIndexColumnChange(e: any) {
        this.hiddenIndexColumn = e.target.checked;
        this.tableService.setHiddenIndexColumn(e.target.checked);
    }

    handleHiddenRowDragChange(e: any) {
        this.hiddenRowDrag = e.target.checked;
        this.tableService.setHiddenRowDrag(e.target.checked);
    }

    handleMaxRecordsChange() {
        this.tableService.setMaxRecords(this.maxRecords);
    }

    handleMaxFieldsChange() {
        this.tableService.setMaxFields(this.maxFields);
    }

    handleGroupChange(e: any) {
        this.group = e.target.checked;
        if (this.group) {
            Actions.addGroupField(this.tableService.aiTable, 'column-1', SortDirection.ascending);
            Actions.addGroupField(this.tableService.aiTable, 'column-2', SortDirection.ascending);
            Actions.addGroupField(this.tableService.aiTable, 'column-4', SortDirection.ascending);
        } else {
            Actions.clearAllGroups(this.tableService.aiTable);
        }
    }

    updateValue() {
        this.isEdit = false;
        if (this.activeViewName !== this.tableService.activeView().name) {
            Actions.setView(this.tableService.aiTable, { name: this.activeViewName }, [this.tableService.activeView()._id]);
        }
    }

    updateEditStatus() {
        this.isEdit = true;
    }

    nameChange(value: string) {
        this.activeViewName = value;
    }

    addView(type: 'add' | 'duplicate') {
        const newView = addView(this.tableService.aiTable, type);
        if (newView) {
            this.tableService.setActiveView(newView._id);
            this.router.navigateByUrl(`/${this.tableService.activeViewShortId()}`);
        }
    }

    removeView() {
        const records = this.tableService.aiTable.records() as AITableViewRecords;
        const fields = this.tableService.aiTable.fields() as AITableViewFields;
        removeView(this.tableService.aiTable, records, fields, this.tableService.activeViewId());
    }

    ngOnDestroy(): void {
        this.tableService.disconnect();
    }
}
