import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AITableGrid } from '@ai-table/grid';
import { ThyAction } from 'ngx-tethys/action';
import { ThyTabs, ThyTab } from 'ngx-tethys/tabs';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ViewService } from '../../service/view.service';

const initViews = [
    { id: 'view1', name: '表格视图1', isActive: true },
    { id: 'view2', name: '表格视图2' }
];

@Component({
    selector: 'ai-table-basic',
    standalone: true,
    imports: [RouterOutlet, AITableGrid, ThyAction, ThyTabs, ThyTab, ThyPopoverModule],
    templateUrl: './basic.component.html',
    providers: [ViewService]
})
export class BasicComponent implements OnInit {
    router = inject(Router);

    viewService = inject(ViewService);

    ngOnInit(): void {
        this.viewService.initViews(initViews);
        this.router.navigate(['/view1']);
    }

    activeTabChange(data: any) {
        this.viewService.updateActiveView(data);
        this.router.navigateByUrl(`/${this.viewService.activeView().id}`);
    }
}
