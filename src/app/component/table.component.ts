import {
    Actions,
    addView,
    buildRecordsWithWillMoveRecords,
    buildSetRecordPositionsActon,
    mergeSorts,
    removeView,
    sortRecordsByConditions
} from '@ai-table/state';
import {
    AITableAction,
    AITableGroupOptions,
    AITableSortOptions,
    AITableView,
    AITableViewFields,
    AITableViewRecords,
    Id,
    SortDirection
} from '@ai-table/utils';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ThyAction } from 'ngx-tethys/action';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyInputDirective } from 'ngx-tethys/input';
import { ThyPopover, ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyAutofocusDirective, ThyEnterDirective, ThyOption } from 'ngx-tethys/shared';
import { ThyTab, ThyTabs } from 'ngx-tethys/tabs';
import { WebsocketProvider } from 'y-websocket';
import { LOCAL_STORAGE_KEY, TableService } from '../service/table.service';
import { ThyButton } from 'ngx-tethys/button';
import { ThySelect } from 'ngx-tethys/select';
import { ThyRadioButton, ThyRadioGroup } from 'ngx-tethys/radio';
import { ThySwitch } from 'ngx-tethys/switch';

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
        ThyAutofocusDirective,
        ThyButton,
        ThySelect,
        ThyOption,
        ThyRadioGroup,
        ThyRadioButton,
        ThySwitch
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

    get tableFields() {
        return this.tableService.aiTable.fields();
    }

    tableSorts: AITableSortOptions = {
        is_keep_sort: false,
        sorts: []
    };

    tableGroups: AITableGroupOptions = {
        groups: [],
        collapsed_group_ids: []
    };

    private thyPopover = inject(ThyPopover);

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

    enterSort() {
        const sorts = this.tableSorts.sorts?.map((sort) => ({ ...sort, direction: parseInt(sort.direction as any) }));
        Actions.setView(
            this.tableService.aiTable,
            { settings: { ...this.tableService.activeView().settings, is_keep_sort: this.tableSorts.is_keep_sort, sorts } },
            [this.tableService.activeViewId()]
        );
        if (!this.tableSorts.is_keep_sort && this.tableSorts.sorts?.length) {
            this.manualSortRecords();
        }
        this.thyPopover.close();
    }

    manualSortRecords() {
        const aiTable = this.tableService.aiTable;
        const activeView = this.tableService.activeView();
        const sortKeysMap = this.tableService.sortKeysMap;
        const records = this.tableService.records();
        const recordsIndexMap = new Map(records?.map((item, index) => [item._id, index]));
        const sorts = activeView.settings?.sorts!;
        const newSortedRecords = sortRecordsByConditions(
            aiTable,
            buildRecordsWithWillMoveRecords(records, aiTable.recordsWillMove()),
            activeView,
            sorts
        );
        const actions: AITableAction[] = [];
        newSortedRecords.forEach((record, index) => {
            const action = buildSetRecordPositionsActon(aiTable, { [activeView._id]: index }, [recordsIndexMap.get(record._id)!]);
            actions.push(action);
        });
        aiTable.apply(actions);
    }

    addSort() {
        this.tableSorts.sorts!.push({
            sort_by: '',
            direction: SortDirection.ascending
        });
    }

    changeSortDirection(e: string, index: number) {
        if (this.tableSorts.is_keep_sort) {
            this.enterSort();
        }
    }

    changeGroupDirection(e: string, index: number) {
        this.enterGroup();
    }

    changeSortField() {
        if (this.tableSorts.is_keep_sort) {
            this.enterSort();
        }
    }

    addGroup() {
        this.tableGroups.groups!.push({
            field_id: '',
            direction: SortDirection.ascending
        });
    }

    deleteSort(index: number) {
        this.tableSorts.sorts!.splice(index, 1);
        if (this.tableSorts.is_keep_sort) {
            this.enterSort();
        }
    }

    deleteGroup(index: number) {
        this.tableGroups.groups!.splice(index, 1);
        this.enterGroup();
    }

    enterGroup() {
        const groups = this.tableGroups.groups?.map((group) => ({ ...group, direction: parseInt(group.direction as any) }));
        Actions.setView(this.tableService.aiTable, { settings: { ...this.tableService.activeView().settings, groups } }, [
            this.tableService.activeViewId()
        ]);
    }

    changeGroupField() {
        this.enterGroup();
    }

    autoSortChange(e: boolean) {
        this.hiddenRowDrag = e;
        this.tableService.setHiddenRowDrag(e);
        const view = this.tableService.activeView();
        Actions.setView(this.tableService.aiTable, { settings: { ...view.settings, is_keep_sort: e } }, [this.tableService.activeViewId()]);
    }

    ngOnDestroy(): void {
        this.tableService.disconnect();
    }
}
