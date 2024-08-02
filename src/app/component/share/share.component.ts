import { Component, OnDestroy, OnInit, WritableSignal, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { WebsocketProvider } from 'y-websocket';
import { ThyAction } from 'ngx-tethys/action';
import { AITableGrid } from '@ai-table/grid';
import { FormsModule } from '@angular/forms';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyTabs, ThyTab } from 'ngx-tethys/tabs';
import { ViewService } from '../../service/view.service';
import { DemoAIRecord, DemoAIField } from '../../types';
import { ShareService } from '../../service/share.service';
import { ThyInputDirective } from 'ngx-tethys/input';
import { getLocalStorage } from '../../utils/utils';

const initViews = [
    { id: 'view1', name: '表格视图1', isActive: true },
    { id: 'view2', name: '表格视图2' }
];

@Component({
    selector: 'ai-table-share',
    standalone: true,
    imports: [RouterOutlet, AITableGrid, ThyAction, ThyTabs, ThyTab, ThyPopoverModule, FormsModule, ThyInputDirective],
    templateUrl: './share.component.html',
    providers: [ViewService, ShareService]
})
export class ShareComponent implements OnInit, OnDestroy {
    provider!: WebsocketProvider | null;

    room = 'share-room-1';

    records!: WritableSignal<DemoAIRecord[]>;

    fields!: WritableSignal<DemoAIField[]>;

    router = inject(Router);

    viewService = inject(ViewService);

    shareService = inject(ShareService);

    ngOnInit(): void {
        this.router.navigate(['/share/view1']);
        this.viewService.initViews(initViews);
        const value = getLocalStorage();
        this.shareService.initRecordsAndFields(value.records, value.fields);
    }

    activeTabChange(data: any) {
        this.viewService.updateActiveView(data);
        this.router.navigateByUrl(`/share/${this.viewService.activeView().id}`);
    }

    handleShared() {
        this.shareService.handleShared(this.room);
    }

    ngOnDestroy(): void {
        this.shareService.disconnect();
    }
}
