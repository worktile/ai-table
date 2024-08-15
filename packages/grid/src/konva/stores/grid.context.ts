import { AITable, AITableFields, AITableRecords } from '@ai-table/grid';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SubjectLike } from 'rxjs/internal/types';

export interface AITableGridState {
    aiTable: AITable;
    fields: AITableFields;
    records: AITableRecords;
}

export class Store<AITableGridState> {
    state$: BehaviorSubject<AITableGridState>;

    constructor() {
        this.state$ = new BehaviorSubject({} as AITableGridState);
    }

    getState(): SubjectLike<AITableGridState> {
        console.log('getState', this.state$);
        return this.state$;
    }

    updateState(data: AITableGridState) {
        console.log('updateState', data);
        this.state$.next({ ...data });
    }

    unsubscribe() {
        this.state$.unsubscribe();
    }
}

export const Context = new Store<AITableGridState>();
