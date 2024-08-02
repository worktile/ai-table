import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { AITableView } from '../types/view';
import { Subject } from 'rxjs';

@Injectable()
export class ViewService {
    views!: WritableSignal<AITableView[]>;

    activeView = computed(() => {
        const activeView = this.views().find((view) => view?.isActive) as AITableView;
        return activeView;
    });

    activeViewChange$ = new Subject<AITableView>();

    initViews(views: AITableView[]) {
        this.views = signal(views);
    }

    updateActiveView(activeViewId: string) {
        this.views.update((value) => {
            const result = value.map((item) => {
                return {
                    ...item,
                    isActive: item.id === activeViewId
                };
            });
            return result;
        });
        this.activeViewChange$.next(this.activeView());
    }
}
