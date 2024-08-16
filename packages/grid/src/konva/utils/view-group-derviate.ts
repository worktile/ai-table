import { AITableRecords } from '@ai-table/grid';
import { AITableGroupInfo } from '../interface/view';
import { AILinearRow, CellType } from '../interface/grid';
import { Group } from 'konva/lib/Group';

export function getLinearRowsAndGroup(groupInfo: AITableGroupInfo[], visibleRows: AITableRecords) {
    const linearRows: AILinearRow[] = [];
    const groupSketch = new Group(groupInfo);
    const groupLevel = groupInfo.length;
    let preRow = { _id: '' };
    const lastRow = { _id: '' };
    let displayRowIndex = 0;
    let groupHeadRecordId = '';
    if (!visibleRows.length && groupInfo.length) {
        linearRows.push({
            type: CellType.Blank,
            depth: 0,
            recordId: ''
        });
        linearRows.push({
            type: CellType.Add,
            depth: 0,
            recordId: ''
        });
    }

    for (const [index, row] of [...visibleRows, lastRow].entries()) {
        // let shouldGenGroupLinearRows = false;
        //   groupInfo.forEach((groupItem, groupItemIndex) => {
        //     const fieldId = groupItem.fieldId;
        //     const field = getField(state, fieldId, this.datasheetId);
        //     const cv1 = this.getFixedCellValue(recordMoveType, preRow.recordId, fieldId);
        //     const cv2 = this.getFixedCellValue(recordMoveType, row.recordId, fieldId);
        //     if (
        //       !row.recordId ||
        //       !preRow.recordId ||
        //       !(Field.bindContext(field, state).compare(cv1, cv2) === 0)
        //     ) {
        //       shouldGenGroupLinearRows = true;
        //       // Because the breakpoint of the upper layer must be the breakpoint of the lower layer,
        //       // so here we have to iterate through them and add a line to each one.
        //       groupInfo.slice(groupItemIndex).forEach((groupItem, subIndex) => {
        //         groupSketch.addBreakpointAndSetGroupTab(groupItem.fieldId, index, row.recordId, subIndex + groupItemIndex);
        //       });
        //     }
        //   });
        //   if (shouldGenGroupLinearRows) {
        //     groupHeadRecordId = row._id;
        //     const groupLinearRows = groupSketch.genGroupLinearRows(
        //       index, row._id, preRow._id,
        //     );
        //     linearRows.push(...groupLinearRows);
        //     displayRowIndex = 0;
        //   }
        preRow = row;
        if (row._id) {
            displayRowIndex++;
            linearRows.push({
                type: CellType.Record,
                depth: groupLevel,
                recordId: row._id,
                displayIndex: displayRowIndex,
                groupHeadRecordId
            });
        }
        if (!groupLevel && !row._id) {
            linearRows.push({
                type: CellType.Add,
                depth: 0,
                recordId: ''
            });
        }
    }
    // groupSketch.cacheGroupBreakpoint();

    return {
        linearRows: linearRows,
        groupSketch
    };
}
