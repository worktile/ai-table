import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    model,
    OnInit,
    Renderer2,
    signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { AI_TABLE_TO_ELEMENT_HOST, AITable, AITableFields, AITableRecords } from '../../core';
import {
    AITableGridContext,
    AITablePointPosition,
    Coordinate,
    createGridStage,
    DEFAULT_POINT_POSITION,
    getLinearRowsAndGroup,
    GRID_FIELD_HEAD_HEIGHT,
    GRID_ROW_HEAD_WIDTH,
    RowHeightLevel
} from '../../konva';

@Component({
    selector: 'grid-view',
    template: `<div class="w-100 h-100 vika-grid-view"></div>`,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-block w-100 h-100 grid-view-container'
    }
})
export class GridView implements OnInit {
    aiTable = input.required<AITable>();

    aiFields = model.required<AITableFields>();

    aiRecords = model.required<AITableRecords>();

    pointPosition = signal<AITablePointPosition>(DEFAULT_POINT_POSITION);

    private elementRef = inject(ElementRef);

    private destroyRef = inject(DestroyRef);

    private render2 = inject(Renderer2);

    constructor() {
        effect(() => {
            const AITable = this.aiTable();
            const fields = this.aiFields();
            const records = this.aiRecords();

            if (AITable || fields || records) {
                this.drawView();
            }
        });
    }

    ngOnInit(): void {
        AI_TABLE_TO_ELEMENT_HOST.set(this.aiTable(), {
            container: this.elementRef.nativeElement.querySelector('.vika-grid-view')
        });
        this.registerEvents(this.elementRef.nativeElement);
    }

    registerEvents(element: HTMLElement) {
        fromEvent<MouseEvent>(element, 'mouseLeave')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => {
                this.pointPosition.set(DEFAULT_POINT_POSITION);
            });
    }

    renderViewStyle(offsetX: number) {
        const container = this.elementRef.nativeElement.querySelector('.vika-grid-view');
        this.render2.setStyle(container, 'marginLeft', `${-offsetX}px`);
    }

    drawView() {
        const offsetX = 32;
        const container = this.elementRef.nativeElement.querySelector('.vika-grid-view');
        const _containerWidth = container.offsetWidth;
        const containerWidth = _containerWidth + offsetX;
        const containerHeight = container.offsetHeight;
        const { linearRows } = getLinearRowsAndGroup([], this.aiRecords());
        const rowCount = linearRows.length;

        /**
         * 当前表格的数据示例。
         * 提供与时间轴和坐标相关的方法。
         */
        const instance = new Coordinate({
            rowHeight: 44,
            columnWidth: 200,
            rowHeightLevel: RowHeightLevel.medium,
            rowCount,
            columnCount: this.aiFields().length,
            containerWidth,
            containerHeight,
            rowInitSize: GRID_FIELD_HEAD_HEIGHT,
            columnInitSize: GRID_ROW_HEAD_WIDTH,
            frozenColumnCount: 1,
            autoHeadHeight: false
        });

        const context: AITableGridContext = {
            aiTable: this.aiTable,
            fields: this.aiFields,
            records: this.aiRecords,
            pointPosition: this.pointPosition,
            // 用于标记选择的开始或填充的状态
            isCellDown: signal(false),
            // Set the behavioural state of a new line
            canAppendRow: signal(true),
            activeUrlAction: signal(false),
            activeCellBound: signal({
                width: 0,
                height: 0
            })
        };

        const gridStage = createGridStage({
            context,
            container,
            instance,
            linearRows,
            scrollState: {
                scrollTop: 0,
                scrollLeft: 0,
                isScrolling: false
            },
            offsetX
        });

        this.renderViewStyle(offsetX);
        gridStage.draw();
    }
}
