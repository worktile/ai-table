import { Injectable, inject, TemplateRef } from '@angular/core';
import { ThySlideService, ThySlideRef } from 'ngx-tethys/slide';
import { ExpandRecordComponent } from './expand-record.component';
import { AITable } from '../../core';
import { AddFieldOptions, AITableReferences } from '@ai-table/utils';
import { GridControlService } from '../../services/grid-control.service';

export interface ExpandRecordConfig {
    aiTable: AITable;

    recordId: string;

    references: AITableReferences;

    addField?: (options: AddFieldOptions) => void;

    // 自定义字段编辑器
    customFieldEditors?: Record<string, any>;

    // 头部更多菜单自定义模板
    headerMoreMenuTemplate?: TemplateRef<any>;

    // 字段操作菜单自定义模板
    fieldOperationsTemplate?: TemplateRef<any>;
}

@Injectable()
export class ExpandRecordService {
    private thySlide = inject(ThySlideService);
    private gridControl = inject(GridControlService);
    private currentSlideRef: ThySlideRef<ExpandRecordComponent> | null = null;

    open(config: ExpandRecordConfig): ThySlideRef<ExpandRecordComponent> {
        this.close();

        this.currentSlideRef = this.thySlide.open(ExpandRecordComponent, {
            from: 'right',
            width: '480px',
            hasBackdrop: true,
            panelClass: 'ai-expand-record-slide',
            initialState: {
                aiTable: config.aiTable,
                recordId: config.recordId,
                references: config.references,
                addField: config.addField,
                customFieldEditors: config.customFieldEditors,
                headerMoreMenuTemplate: config.headerMoreMenuTemplate,
                fieldOperationsTemplate: config.fieldOperationsTemplate
            }
        });

        this.currentSlideRef.afterClosed().subscribe(() => {
            this.currentSlideRef = null;
            this.gridControl.clearActiveCell();
        });

        return this.currentSlideRef;
    }

    close(): void {
        this.currentSlideRef?.close();
        this.currentSlideRef = null;
    }

    isOpen(): boolean {
        return this.currentSlideRef !== null;
    }

    getCurrentRecordId(): string | null {
        return this.currentSlideRef?.componentInstance?.currentRecordId() || null;
    }
}
