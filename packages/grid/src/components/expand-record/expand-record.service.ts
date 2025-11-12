import { Injectable, inject, TemplateRef } from '@angular/core';
import { ThySlideService, ThySlideRef } from 'ngx-tethys/slide';
import { ExpandRecordComponent } from './expand-record.component';
import { AITable } from '../../core';
import { AddFieldOptions, AITableReferences, IdPath, UpdateFieldValueOptions } from '@ai-table/utils';
import { GridControlService } from '../../services/grid-control.service';

export interface ExpandRecordConfig {
    readonly aiTable: AITable;

    readonly recordId: string;

    readonly references: AITableReferences;

    // 添加字段
    readonly addField: (options: AddFieldOptions) => void;

    // 删除行
    readonly removeRecord: (path: IdPath) => void;

    // 字段值更新
    readonly fieldValueChange: (options: UpdateFieldValueOptions[]) => void;

    // 自定义字段编辑器
    readonly customFieldEditors?: Record<string, any>;

    // 头部更多菜单自定义模板
    readonly headerMoreMenuTemplate?: TemplateRef<any>;

    // 字段操作菜单自定义模板
    readonly fieldOperationsTemplate?: TemplateRef<any>;
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
                removeRecord: config.removeRecord,
                fieldValueChange: config.fieldValueChange,
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
