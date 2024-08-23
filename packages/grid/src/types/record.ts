export enum AITableRowType {
    add = 'addRecord',
    blank = 'blank',
    record = 'record'
}

export type AITableCellMetaData = {
    size: number;
    offset: number;
};

export type AITableCellMetaDataMap = Record<number, AITableCellMetaData>;

export interface AITableLinearRowBase {
    depth: number;
    recordId: string;
}

export type AITableLinearRowBlank = AITableLinearRowBase & {
    type: AITableRowType.blank;
};

export type AITableLinearRowAdd = AITableLinearRowBase & {
    type: AITableRowType.add;
};

export type AITableLinearRowRecord = AITableLinearRowBase & {
    type: AITableRowType.record;
    groupHeadRecordId: string;
    displayIndex: number;
};

export type AITableLinearRow = AITableLinearRowBlank | AITableLinearRowAdd | AITableLinearRowRecord;
