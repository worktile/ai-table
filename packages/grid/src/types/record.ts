export enum AITableRowType {
    GroupTab = 'GroupTab',
    Add = 'AddRecord',
    Blank = 'Blank',
    Record = 'Record'
}

export type AITableCellMetaData = {
    size: number;
    offset: number;
};

export type AITableCellMetaDataMap = Record<number, AITableCellMetaData>;
