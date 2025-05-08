import * as Y from 'yjs';
import { translateArrayEvent } from './array-event';
import { SharedType, SyncArrayElement, SyncMapElement } from '../../types/shared';
import { ActionName, AITableAction } from '@ai-table/utils';
import { getSharedRecord, getSharedRecordIndex } from '../utils';
export * from './array-event';

export function translateYjsEvent(sharedType: SharedType, event: Y.YEvent<any>): AITableAction[] {
    if (event instanceof Y.YArrayEvent) {
        return translateArrayEvent(sharedType, event);
    }
    return [];
}

export function applyEvents(sharedType: SharedType, events: Y.YEvent<any>[]) {
    const actions: AITableAction[] = [];
    events.forEach((event) => {
        actions.push(...translateYjsEvent(sharedType, event));
    });
    return actions;
}

export function correctSharedType(sharedType: SharedType, actions: AITableAction[]) {
    const addRecordOrFields = actions.filter(
        (action) => action.type === ActionName.AddRecord || action.type === ActionName.AddField || action.type === ActionName.RemoveField
    );
    addRecordOrFields.forEach((action) => {
        const sharedFields = sharedType.get('fields')! as Y.Array<SyncMapElement>;
        const sharedRecords = sharedType.get('records')! as Y.Array<SyncArrayElement>;
        const fieldCount = sharedFields.length;
        if (action.type === ActionName.AddRecord) {
            const sharedRecordIndex = getSharedRecordIndex(sharedRecords, action.record._id);
            improveGhostCells(sharedRecords, sharedFields, sharedRecordIndex, fieldCount);
        }
        if (action.type === ActionName.AddField) {
            sharedRecords.forEach((record, index) => {
                improveGhostCells(sharedRecords, sharedFields, index, fieldCount);
            });
        }
        if (action.type === ActionName.RemoveField) {
            // 撤回的场景，列删除了，但是补全的幽灵单元格并没有删除
            sharedRecords.forEach((record, index) => {
                removeGhostCells(sharedRecords, sharedFields, index, fieldCount);
            });
        }
    });
}

export function improveGhostCells(
    sharedRecords: Y.Array<SyncArrayElement>,
    sharedFields: Y.Array<SyncMapElement>,
    sharedRecordIndex: number,
    fieldCount: number
) {
    const sharedRecord = getSharedRecord(sharedRecords, sharedRecordIndex);
    const [, customFieldValues] = sharedRecord;
    if (fieldCount !== customFieldValues.length && fieldCount > customFieldValues.length) {
        console.log(
            `Record Index：${sharedRecordIndex} 字段数量不一致，sharedFields.length: ${sharedFields.length}, customFieldValues.length: ${customFieldValues.length}`
        );
        for (let i = 0; i < fieldCount; i++) {
            if (customFieldValues.get(i) === undefined) {
                (customFieldValues as Y.Array<any>).push([null]);
                console.log(`补充幽灵单元格位置：${sharedRecordIndex} ${i}，value: ${(customFieldValues as Y.Array<any>).get(i)}`);
            }
        }
    } else if (fieldCount !== customFieldValues.length) {
        console.log(
            `Record Index：${sharedRecordIndex} 字段数量不一致（字段数小于数据长度），sharedFields.length: ${sharedFields.length}, customFieldValues.length: ${customFieldValues.length}`
        );
    }
}

export function removeGhostCells(
    sharedRecords: Y.Array<SyncArrayElement>,
    sharedFields: Y.Array<SyncMapElement>,
    sharedRecordIndex: number,
    fieldCount: number
) {
    const sharedRecord = getSharedRecord(sharedRecords, sharedRecordIndex);
    const [, customFieldValues] = sharedRecord;
    if (fieldCount !== customFieldValues.length && fieldCount < customFieldValues.length) {
        console.log(
            `记录索引：${sharedRecordIndex} 字段数量不一致，sharedFields.length: ${sharedFields.length}, customFieldValues.length: ${customFieldValues.length}`
        );
        const deleteCount = customFieldValues.length - fieldCount;
        (customFieldValues as Y.Array<any>).delete(fieldCount, deleteCount);
        console.log(`删除幽灵单元格，行：${sharedRecordIndex}，开始列：${fieldCount}，删除数量：${deleteCount}`);
    }
}
