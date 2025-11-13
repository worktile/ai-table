import { Injectable, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { ThySlideService, ThySlideRef } from 'ngx-tethys/slide';
import { RecordDetailComponent } from '../components/record-detail/record-detail.component';
import { AITable } from '../core';
import { AITableReferences } from '@ai-table/utils';
import { AITableActions, clearSelection } from '../utils';
import { fromEvent } from 'rxjs';
import { Subscription } from 'rxjs';

export interface RecordDetailConfig {
    readonly viewContainerRef: ViewContainerRef;

    readonly aiTable: AITable;

    readonly recordId: string;

    readonly references: AITableReferences;

    readonly actions: AITableActions;

    readonly origin?: HTMLElement;

    // 自定义字段编辑器
    readonly customFieldEditors?: Record<string, any>;

    // 头部更多菜单自定义模板
    readonly headerMoreMenuTemplate?: TemplateRef<any>;

    // 字段操作菜单自定义模板
    readonly fieldOperationsTemplate?: TemplateRef<any>;
}

@Injectable()
export class RecordDetailService {
    private thySlide = inject(ThySlideService);
    private currentSlideRef: ThySlideRef<RecordDetailComponent> | null = null;
    private clickSubscription: Subscription | null = null;
    private config: RecordDetailConfig | null = null;

    open(config: RecordDetailConfig): ThySlideRef<RecordDetailComponent> {
        this.config = config;
        this.currentSlideRef = this.thySlide.open(RecordDetailComponent, {
            origin: config.origin,
            from: 'right',
            width: '480px',
            hasBackdrop: false,
            panelClass: 'ai-expand-record-slide',
            initialState: {
                aiTable: config.aiTable,
                recordId: config.recordId,
                references: config.references,
                actions: config.actions,
                customFieldEditors: config.customFieldEditors,
                headerMoreMenuTemplate: config.headerMoreMenuTemplate,
                fieldOperationsTemplate: config.fieldOperationsTemplate
            }
        });
        if (this.currentSlideRef) {
            this.currentSlideRef.afterOpened().subscribe(() => {
                this.setupDocumentClickListener(config);
            });
            this.currentSlideRef.afterClosed().subscribe(() => {
                this.close();
            });
        }

        return this.currentSlideRef;
    }

    close(): void {
        this.currentSlideRef?.close();
        if (this.clickSubscription) {
            this.clickSubscription.unsubscribe();
            this.clickSubscription = null;
        }
        this.currentSlideRef = null;
        if (this.config) {
            clearSelection(this.config.aiTable);
            this.config = null;
        }
    }

    isOpen(): boolean {
        return this.currentSlideRef !== null;
    }

    private isClickInsideTableOrPanel(event: MouseEvent, viewContainerRef: ViewContainerRef): boolean {
        const target = event.target as HTMLElement;

        // 检查是否点击在表格内
        const tableElement = viewContainerRef.element.nativeElement.querySelector('.ai-table-grid');
        if (tableElement && tableElement.contains(target)) {
            return true;
        }

        // 检查 CDK overlay 容器（用于处理弹窗、popover）
        const overlayContainers = document.querySelectorAll('.cdk-overlay-container');
        for (let i = 0; i < overlayContainers.length; i++) {
            if (overlayContainers[i].contains(target)) {
                return true;
            }
        }

        return false;
    }

    private setupDocumentClickListener(config: RecordDetailConfig): void {
        if (this.clickSubscription) {
            this.clickSubscription.unsubscribe();
            this.clickSubscription = null;
        }

        this.clickSubscription = fromEvent<MouseEvent>(document, 'click').subscribe((event) => {
            if (!this.isClickInsideTableOrPanel(event, config.viewContainerRef)) {
                this.close();
            }
        });
    }
}
