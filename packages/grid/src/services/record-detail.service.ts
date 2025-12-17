import { Injectable, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { ThySlideService, ThySlideRef } from 'ngx-tethys/slide';
import { RecordDetailComponent } from '../components/record-detail/record-detail.component';
import { AITable } from '../core';
import { AITableFieldType, AITableReferences } from '@ai-table/utils';
import { AITableActions, clearSelection } from '../utils';
import { fromEvent } from 'rxjs';
import { Subscription } from 'rxjs';
import { AITableGridCellRenderSchema } from '../types';
import { AITableRecordDetailConfig } from '../types';

export interface RecordDetailConfig {
    readonly viewContainerRef?: ViewContainerRef;

    readonly aiTable?: AITable;

    readonly recordId?: string;

    readonly references?: AITableReferences;

    readonly actions?: AITableActions;
}

@Injectable()
export class RecordDetailService {
    private thySlide = inject(ThySlideService);
    private currentSlideRef: ThySlideRef<RecordDetailComponent> | null = null;
    private clickSubscription: Subscription | null = null;
    private config: (RecordDetailConfig & AITableRecordDetailConfig) | null = null;

    // : ThySlideRef<RecordDetailComponent>
    open(config: RecordDetailConfig & AITableRecordDetailConfig) {
        // if (this.isOpen()) {
        //     this.currentSlideRef?.componentInstance.setSelection(config.recordId!);
        //     return this.currentSlideRef!;
        // }
        // this.config = config;
        // this.currentSlideRef =
        this.thySlide.open(RecordDetailComponent, {
            viewContainerRef: config.viewContainerRef,
            from: 'right',
            width: '480px',
            // hasBackdrop: false,
            // panelClass: 'ai-expand-record-slide',
            initialState: {
                aiTable: config.aiTable,
                recordId: config.recordId,
                references: config.references,
                actions: config.actions
            }
            // ...config.slideConfig
        });
        // if (this.currentSlideRef) {
        //     this.currentSlideRef.afterOpened().subscribe(() => {
        //         this.setupDocumentClickListener(config);
        //     });
        //     this.currentSlideRef.afterClosed().subscribe(() => {
        //         this.close();
        //     });
        // }

        // return this.currentSlideRef;
    }

    close(): void {
        this.currentSlideRef?.close();
        if (this.clickSubscription) {
            this.clickSubscription.unsubscribe();
            this.clickSubscription = null;
        }
        this.currentSlideRef = null;
        if (this.config) {
            clearSelection(this.config.aiTable!);
            this.config = null;
        }
    }

    isOpen(): boolean {
        return this.currentSlideRef !== null;
    }

    private canCloseSlide(event: MouseEvent, viewContainerRef: ViewContainerRef): boolean {
        const target = event.target as HTMLElement;

        const tableElement = viewContainerRef.element.nativeElement;
        if (tableElement && tableElement.contains(target)) {
            return false;
        }

        const overlayContainers = document.querySelectorAll('.cdk-overlay-container');
        for (let i = 0; i < overlayContainers.length; i++) {
            if (overlayContainers[i].contains(target)) {
                return false;
            }
        }

        return true;
    }

    // private setupDocumentClickListener(config: RecordDetailConfig & AITableRecordDetailConfig): void {
    //     if (this.clickSubscription) {
    //         this.clickSubscription.unsubscribe();
    //         this.clickSubscription = null;
    //     }

    //     this.clickSubscription = fromEvent<MouseEvent>(document, 'click').subscribe((event) => {
    //         const callback = config.canCloseSlideCallback ? config.canCloseSlideCallback : this.canCloseSlide;
    //         if (callback(event, config.viewContainerRef)) {
    //             this.close();
    //         }
    //     });
    // }
}
