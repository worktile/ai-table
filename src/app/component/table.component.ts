import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { WebsocketProvider } from 'y-websocket';
import { ThyAction } from 'ngx-tethys/action';
import { AITableFields, AITableGrid, AITableRecords } from '@ai-table/grid';
import { FormsModule } from '@angular/forms';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyTabs, ThyTab } from 'ngx-tethys/tabs';
import { ThyInputDirective } from 'ngx-tethys/input';
import { TableService, LOCAL_STORAGE_KEY } from '../service/table.service';
import { AITableView, getDefaultView, translateToRecords, ViewActions } from '@ai-table/state';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyAutofocusDirective, ThyEnterDirective } from 'ngx-tethys/shared';
import { getInitViews } from '../utils/utils';

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

    room = 'share-dexxxmo-action-1';

    router = inject(Router);

    tableService = inject(TableService);

    isEdit = false;

    activeViewName!: string;

    ngOnInit(): void {
        const initViews = getInitViews();
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
        let newView: AITableView | undefined;
        if (this.tableService.sharedType) {
            const data = this.tableService.sharedType.toJSON();
            const fields: AITableFields = data['fields'];
            const records: AITableRecords = translateToRecords(data['records'], fields);
            const recordPositions = records.map((item) => item._id);
            const fieldPositions = fields.map((item) => item._id);
            newView = getDefaultView(this.tableService.views(), recordPositions, fieldPositions);
        } else {
            newView = getDefaultView(this.tableService.views());
        }
        if (newView) {
            ViewActions.addView(this.tableService.aiTable, newView, [this.tableService.views().length]);
        }
    }

    removeView() {
        ViewActions.removeView(this.tableService.aiTable, [this.tableService.activeViewId()]);
    }

    ngOnDestroy(): void {
        this.tableService.disconnect();
    }
}
