import Konva from 'konva';
import { AITableRowHeadsOptions, AITableRowType } from '../../types';
import { AI_TABLE_ROW_ADD_BUTTON } from '../../constants';
import { Context } from '../../core/context';

export const createOtherRows = (options: AITableRowHeadsOptions) => {
    const { coordinate, rowStartIndex, rowStopIndex, aiTable } = options;
    const otherRows = [];
    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        if (rowIndex > coordinate.rowCount - 1) break;
        const { _id, type } = (aiTable.context as Context).linearRows()[rowIndex];
        if (type === AITableRowType.record) continue;
        const y = coordinate.getRowOffset(rowIndex);
        const curHeight = coordinate.getRowHeight(rowIndex);
        switch (type) {
            case AITableRowType.add: {
                const rect = new Konva.Rect({
                    key: `row-add-${_id}`,
                    y: y + 1,
                    name: AI_TABLE_ROW_ADD_BUTTON,
                    width: coordinate.containerWidth,
                    height: curHeight - 1,
                    fill: 'transparent'
                });
                otherRows.push(rect);
                break;
            }
        }
    }
    return otherRows;
};
