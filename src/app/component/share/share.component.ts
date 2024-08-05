import { AfterViewInit, Component, OnDestroy, OnInit, signal, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebsocketProvider } from 'y-websocket';
import { applyYjsEvents } from '../../share/apply-to-table';
import applyActionOps from '../../share/apply-to-yjs';
import { connectProvider } from '../../share/provider';
import { SharedType, getSharedType } from '../../share/shared';
import { translateSharedTypeToTable } from '../../share/utils/translate-to-table';
import { YjsAITable } from '../../share/yjs-table';
import { CommonComponent } from '../common/common.component';
import { ThyAction } from 'ngx-tethys/action';
import { AITable, AITableGrid } from '@ai-table/grid';
import { ThyInputDirective } from 'ngx-tethys/input';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'ai-table-share',
    standalone: true,
    imports: [RouterOutlet, CommonComponent, AITableGrid, ThyAction, FormsModule, ThyInputDirective],
    templateUrl: './share.component.html'
})
export class ShareComponent extends CommonComponent implements OnInit, AfterViewInit, OnDestroy {
    sharedType!: SharedType | null;

    provider!: WebsocketProvider | null;

    room = 'room-2';

    override ngOnInit(): void {
        const value = this.getLocalStorage();
        this.records = signal(value.records);
        this.fields = signal(value.fields);
        console.time('shared-render');
    }

    override ngAfterViewInit() {
        console.timeEnd('shared-render');
    }

    initialized(aiTable: AITable) {
        this.aiTable = aiTable;
    }

    handleShared() {
        if (this.provider) {
            this.disconnect();
            return;
        }
        const isInitializeSharedType = false;
        this.sharedType = getSharedType(
            {
                records: this.records(),
                fields: this.fields(),
                views: this.views()
            },
            !!isInitializeSharedType
        );
        let isInitialized = false;
        this.provider = connectProvider(this.sharedType.doc!, this.room, isDevMode());
        this.sharedType.observeDeep((events: any) => {
            if (!YjsAITable.isLocal(this.aiTable)) {
                if (!isInitialized) {
                    const data = translateSharedTypeToTable(this.sharedType!);
                    this.records.set(data.records);
                    this.fields.set(data.fields);
                    this.views.set(data.views);
                    isInitialized = true;
                    console.log(this.fields());
                } else {
                    applyYjsEvents(this.aiTable, events);
                }
            }
        });
        if (!isInitializeSharedType) {
            localStorage.setItem('ai-table-shared-type', 'true');
        }
    }

    override onChange(data: any) {
        super.onChange(data);
        if (this.provider) {
            if (!YjsAITable.isRemote(this.aiTable) && !YjsAITable.isUndo(this.aiTable)) {
                YjsAITable.asLocal(this.aiTable, () => {
                    applyActionOps(this.sharedType!, data.actions, this.aiTable);
                });
            }
        }
    }

    disconnect() {
        if (this.provider) {
            this.provider.disconnect();
            this.provider = null;
        }
    }

    override ngOnDestroy(): void {
        this.disconnect();
    }
}
