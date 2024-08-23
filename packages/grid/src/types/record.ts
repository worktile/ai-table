export enum AITableRowType {
    Add = 'AddRecord',
    Blank = 'Blank',
    Record = 'Record'
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
    type: AITableRowType.Blank;
};

export type AITableLinearRowAdd = AITableLinearRowBase & {
    type: AITableRowType.Add;
};

export type AITableLinearRowRecord = AITableLinearRowBase & {
    type: AITableRowType.Record;
    groupHeadRecordId: string;
    displayIndex: number;
};

export type AITableLinearRow = AITableLinearRowBlank | AITableLinearRowAdd | AITableLinearRowRecord;
