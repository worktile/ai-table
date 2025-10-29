import { Component, signal, model, inject, TemplateRef } from '@angular/core';
import { Id, AITableViewRecords, AITableViewFields, AITableView } from '@ai-table/utils';
import { addView, removeView, Actions, AIViewTable } from '@ai-table/state';
import { ThyNav, ThyNavItemDirective } from 'ngx-tethys/nav';
import { ThyAction } from 'ngx-tethys/action';
import { FormsModule } from '@angular/forms';
import { ThyInputDirective } from 'ngx-tethys/input';
import { ThyEnterDirective, ThyAutofocusDirective } from 'ngx-tethys/shared';
import { ThyDropdownMenuComponent, ThyDropdownMenuItemDirective } from 'ngx-tethys/dropdown';
import { ViewService } from '../view.service';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ThyPopover } from 'ngx-tethys/popover';

@Component({
    selector: 'app-views-example',
    templateUrl: './views.component.html',
    imports: [
        ThyNav,
        ThyNavItemDirective,
        ThyAction,
        FormsModule,
        ThyEnterDirective,
        ThyInputDirective,
        ThyAutofocusDirective,
        ThyDropdownMenuComponent,
        ThyDropdownMenuItemDirective,
        CdkDrag,
        CdkDropList
    ]
})
export class ViewsExample {
    private thyPopover = inject(ThyPopover);

    aiTable = model.required<AIViewTable>();

    viewService = inject(ViewService);

    editViewId = signal<Id | null>(null);

    editingViewName = '';

    operateViewId = '';

    addView(type: 'add' | 'duplicate', viewId?: Id) {
        const newView = addView(this.aiTable(), type, viewId);
        if (newView) {
            this.viewService.setActiveView(newView._id);
        }
    }

    updateView() {
        this.editViewId.set(null);
        const { activeView } = this.viewService;
        if (this.editingViewName && this.editingViewName !== activeView()?.name) {
            Actions.setView(this.aiTable(), { name: this.editingViewName }, [activeView()?._id as string]);
        }
    }

    removeView(viewId: Id) {
        const aiTable = this.aiTable();
        const { sortedViews } = this.viewService;
        const deletedViewIndex = sortedViews()?.findIndex((view) => view._id === viewId);
        removeView(aiTable, aiTable.records() as AITableViewRecords, aiTable.fields() as AITableViewFields, viewId);

        const nextActiveView = sortedViews().find((view, index) => index === deletedViewIndex - 1);
        this.viewService.setActiveView(nextActiveView?._id || sortedViews()[0]._id);
    }

    switchView(viewId: Id) {
        this.viewService.setActiveView(viewId);
    }

    sortViews(event: CdkDragDrop<AITableView[]>) {
        const previousIndex = event.previousIndex;
        const currentIndex = event.currentIndex;
        if (previousIndex === currentIndex) {
            return;
        }

        const views = this.viewService.sortedViews();
        if (previousIndex < 0 || previousIndex >= views.length || currentIndex < 0 || currentIndex >= views.length) {
            return;
        }

        let newPosition: number;
        if (currentIndex === 0) {
            const firstViewPosition = views[0]?.position;
            if (firstViewPosition && firstViewPosition > 0) {
                newPosition = firstViewPosition! / 2;
            } else {
                newPosition = firstViewPosition! - 1;
            }
        } else if (currentIndex === views.length - 1) {
            newPosition = views[currentIndex].position! + 1;
        } else {
            const adjacentIndex = previousIndex > currentIndex ? currentIndex - 1 : currentIndex + 1;
            newPosition = (views[currentIndex].position! + views[adjacentIndex].position!) / 2;
        }

        const viewId = event.item.data;
        Actions.setView(this.aiTable(), { position: newPosition }, [viewId]);
    }

    renameView(viewId: Id) {
        this.editViewId.set(viewId);
    }

    viewNameChange(value: string) {
        this.editingViewName = value;
    }

    openViewMenu(event: MouseEvent, menu: TemplateRef<HTMLElement>, viewId: Id) {
        event.stopPropagation();
        this.operateViewId = viewId;
        this.thyPopover
            .open(menu, {
                origin: event.target as HTMLElement,
                placement: 'bottomLeft',
                insideClosable: true
            })
            .afterClosed()
            .subscribe(() => {
                this.operateViewId = '';
            });
    }
}
