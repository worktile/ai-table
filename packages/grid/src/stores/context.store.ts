import {
    AIGrid,
    AILinearRow,
    AITable,
    AITableCellScrollState,
    AITableFields,
    AITableGridContext,
    AITablePointPosition,
    AITableRecords,
    AITableScrollState,
    CellBound,
    Coordinate,
    DEFAULT_POINT_POSITION,
    getLinearRowsAndGroup,
    GRID_FIELD_HEAD_HEIGHT,
    GRID_ROW_HEAD_WIDTH,
    RowHeightLevel
} from '@ai-table/grid';
import { BehaviorSubject } from 'rxjs';

export interface ContextStoreState {
    context: AITableGridContext;
    instance: Coordinate;
    offsetX?: number;
}

export class ContextStore {
    offsetX = 32;

    state$: BehaviorSubject<ContextStoreState> = new BehaviorSubject(undefined as any);

    pointPosition$: BehaviorSubject<AITablePointPosition> = new BehaviorSubject(DEFAULT_POINT_POSITION);

    constructor(config: {
        container: HTMLElement;
        aiTable: AITable;
        fields: AITableFields;
        records: AITableRecords;
        linearRows: AILinearRow[];
    }) {
        this.initialize(config);
    }

    private initialize(config: {
        container: HTMLElement;
        aiTable: AITable;
        fields: AITableFields;
        records: AITableRecords;
        linearRows: AILinearRow[];
    }) {
        const { container, aiTable, fields, records, linearRows } = config;
        const _containerWidth = container.offsetWidth;
        const containerWidth = _containerWidth + this.offsetX;
        const containerHeight = container.offsetHeight;
        const rowCount = linearRows.length;
        const context = {
            aiTable,
            fields,
            records,
            linearRows,
            pointPosition: DEFAULT_POINT_POSITION,
            isCellDown: false,
            canAppendRow: true,
            activeUrlAction: false,
            activeCellBound: {
                width: 0,
                height: 0
            },
            scrollState: {
                scrollTop: 0,
                scrollLeft: 0,
                isScrolling: false
            },
            cellScrollState: {
                scrollTop: 0,
                totalHeight: 0,
                isOverflow: false
            },
            setPointPosition: (pointPosition: AITablePointPosition) => this.setPointPosition(pointPosition),
            setCellDown: (cellDown: boolean) => this.setCellDown(cellDown),
            setCanAppendRow: (canAppendRow: boolean) => this.setCanAppendRow(canAppendRow),
            setActiveUrlAction: (activeUrlAction: boolean) => this.setActiveUrlAction(activeUrlAction),
            setActiveCellBound: (activeCellBound: Partial<CellBound>) => this.setActiveCellBound(activeCellBound),
            setScrollState: (scrollState: Partial<AITableScrollState>) => this.setScrollState(scrollState),
            setCellScrollState: (cellScrollState: Partial<AITableCellScrollState>) => this.setCellScrollState(cellScrollState)
        };
        const visibleColumns = AIGrid.getVisibleColumns(context);
        const initialState = {
            context,
            instance: new Coordinate({
                rowHeight: 44,
                columnWidth: 200,
                rowHeightLevel: RowHeightLevel.medium,
                rowCount,
                columnCount: visibleColumns.length,
                containerWidth,
                containerHeight,
                rowInitSize: GRID_FIELD_HEAD_HEIGHT,
                columnInitSize: GRID_ROW_HEAD_WIDTH,
                frozenColumnCount: 1,
                autoHeadHeight: false
            }),
            offsetX: this.offsetX
        };
        this.state$.next(initialState);
    }

    updateContextState(state: Partial<AITableGridContext>) {
        const records = state.records ?? this.state$.getValue().context.records;
        const { linearRows } = getLinearRowsAndGroup([], records);
        const rowCount = linearRows.length;
        const newState: ContextStoreState = {
            context: {
                ...this.state$.getValue().context,
                ...state
            },
            instance: new Coordinate({
                ...this.state$.getValue().instance,
                rowHeight: 44,
                columnWidth: 200,
                rowCount
            })
        };
        this.state$.next(newState);
    }

    getCurrentValue() {
        return this.state$.getValue();
    }

    setPointPosition(pointPosition: AITablePointPosition) {
        const { context, instance } = this.getCurrentValue();
        context.pointPosition = pointPosition;
        this.pointPosition$.next(pointPosition);
        this.state$.next({ context, instance });
    }

    setCellDown(isCellDown: boolean) {
        const { context, instance } = this.getCurrentValue();
        context.isCellDown = isCellDown;
        this.state$.next({ context, instance });
    }

    setCanAppendRow(canAppendRow: boolean) {
        const { context, instance } = this.getCurrentValue();
        context.canAppendRow = canAppendRow;
        this.state$.next({ context, instance });
    }

    setActiveUrlAction(activeUrlAction: boolean) {
        const { context, instance } = this.getCurrentValue();
        context.activeUrlAction = activeUrlAction;
        this.state$.next({ context, instance });
    }

    setActiveCellBound(activeCellBound: Partial<CellBound>) {
        const { context, instance } = this.getCurrentValue();
        context.activeCellBound = {
            ...context.activeCellBound,
            ...activeCellBound
        };
        this.state$.next({ context, instance });
    }

    setScrollState(scrollState: Partial<AITableScrollState>) {
        const { context, instance } = this.getCurrentValue();
        context.scrollState = {
            ...context.scrollState,
            ...scrollState
        };
        this.state$.next({ context, instance });
    }

    setCellScrollState(cellScrollState: Partial<AITableCellScrollState>) {
        const { context, instance } = this.getCurrentValue();
        context.cellScrollState = {
            ...context.cellScrollState,
            ...cellScrollState
        };
        this.state$.next({ context, instance });
    }
}
