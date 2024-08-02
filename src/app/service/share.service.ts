import { Injectable, isDevMode, signal, WritableSignal } from '@angular/core';
import { getSharedType, SharedType } from '../share/shared';
import { WebsocketProvider } from 'y-websocket';
import { getProvider } from '../share/provider';
import { DemoAIField, DemoAIRecord } from '../types';
import { ViewService } from './view.service';
import { sortDataByPositions } from '../utils/utils';
import { applyYjsEvents } from '../share/apply-to-table';
import { translateSharedTypeToTable } from '../share/utils/translate-to-table';
import { YjsAITable } from '../share/yjs-table';
import { AITable } from '@ai-table/grid';

@Injectable()
export class ShareService {
    provider!: WebsocketProvider | null;

    sharedType!: SharedType | null;

    records!: WritableSignal<DemoAIRecord[]>;

    fields!: WritableSignal<DemoAIField[]>;

    aiTable!: AITable;

    constructor(public viewService: ViewService) {}

    setAITable(aiTable: AITable) {
        this.aiTable = aiTable;
    }

    initRecordsAndFields(records: DemoAIRecord[], fields: DemoAIField[]) {
        this.records = signal(sortDataByPositions(records, this.viewService.activeView().id) as DemoAIRecord[]);
        this.fields = signal(sortDataByPositions(fields, this.viewService.activeView().id) as DemoAIField[]);
    }

    setRecords(records?: DemoAIRecord[]) {
        this.records.set(sortDataByPositions(records ?? this.records(), this.viewService.activeView().id) as DemoAIRecord[]);
    }

    setFields(fields?: DemoAIField[]) {
        this.fields.set(sortDataByPositions(fields ?? this.fields(), this.viewService.activeView().id) as DemoAIField[]);
    }

    handleShared(room: string) {
        if (this.provider) {
            this.disconnect();
            return;
        }
        this.sharedType = getSharedType(
            {
                records: this.records(),
                fields: this.fields()
            },
            false
        );
        this.provider = getProvider(this.sharedType.doc!, room, isDevMode());
        this.provider.connect();
        let isInitialized = false;
        this.sharedType.observeDeep((events: any) => {
            if (!YjsAITable.isLocal(this.aiTable)) {
                if (!isInitialized) {
                    const data = translateSharedTypeToTable(this.sharedType!, this.viewService.views());
                    this.setRecords(data.records);
                    this.setFields(data.fields);
                    isInitialized = true;
                } else {
                    applyYjsEvents(this.aiTable, events);
                }
            }
        });
    }

    disconnect() {
        if (this.provider) {
            this.provider.disconnect();
            this.provider = null;
            this.sharedType = null;
        }
    }
}
