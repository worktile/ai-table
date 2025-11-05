import { sortViews } from '@ai-table/state';
import { AITableView, AITableViews, Id } from '@ai-table/utils';
import { computed, Injectable, signal } from '@angular/core';

@Injectable()
export class ViewService {
    views = signal<AITableView[]>([]);

    activeViewId = signal<string>('');

    activeView = computed<AITableView>(() => {
        return this.views().find((view) => view._id === this.activeViewId()) as AITableView;
    });

    sortedViews = computed(() => {
        return sortViews(this.views());
    });

    setActiveView(viewId: Id) {
        this.activeViewId.set(viewId);
    }

    setViews(views: AITableViews) {
        this.views.set(views);
    }
}
