import Konva from 'konva';
import { AITableRowHeadsOptions, AITableRowType } from '../../types';
import { AI_TABLE_ROW_ADD_BUTTON } from '../../constants';

export const createOtherRows = (options: AITableRowHeadsOptions) => {
    const { instance, rowStartIndex, rowStopIndex, context } = options;
    const otherRows = [];
    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        if (rowIndex > instance.rowCount - 1) break;
        const { _id, type } = context.linearRows()[rowIndex];
        if (type === AITableRowType.record) continue;
        const y = instance.getRowOffset(rowIndex);
        const curHeight = instance.getRowHeight(rowIndex);
        switch (type) {
            case AITableRowType.add: {
                const rect = new Konva.Rect({
                    key: `row-add-${_id}`,
                    y: y + 1,
                    name: AI_TABLE_ROW_ADD_BUTTON,
                    width: instance.containerWidth,
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
