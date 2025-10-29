import { isSystemField, FieldModelMap, AITable } from '@ai-table/grid';
import { AIViewTable } from '../../types';
import {
    AITableRecord,
    AITableField,
    AITableFieldType,
    FieldValue,
    SelectSettings,
    SystemFieldTypes,
    AITableViewRecords,
    AITableViewFields,
    AITableView,
    AITableFilterConditions,
    AITableFilterLogical,
    AITableViewField,
    AITableFilterCondition,
    AITableFilterOperation,
    isEmpty
} from '@ai-table/utils';

export function getFilteredRecords(aiTable: AIViewTable, records: AITableViewRecords, fields: AITableViewFields, activeView: AITableView) {
    const { conditions, condition_logical } = activeView.settings || {};
    if (!conditions) {
        return records;
    }
    const illegalConditions = conditions.filter((item) => item.operation) || [];
    if (!illegalConditions.length) {
        return records;
    }
    const recordsWillHidden = aiTable.recordsWillHidden();
    return records.filter((record) => {
        if (recordsWillHidden && recordsWillHidden.length && recordsWillHidden.includes(record._id)) {
            return true;
        }
        return checkConditions(aiTable, fields, record, { conditions: illegalConditions, condition_logical });
    });
}

export function checkConditions(
    aiTable: AIViewTable,
    fields: AITableViewFields,
    record: AITableRecord,
    filterConditions?: AITableFilterConditions
) {
    if (!record) {
        return false;
    }

    if (!aiTable.activeViewId?.() || !aiTable.viewsMap?.()) {
        return true;
    }

    if (!filterConditions?.conditions) {
        const conditions = aiTable.viewsMap()[aiTable.activeViewId()].settings?.conditions;
        const conditionLogical = aiTable.viewsMap()[aiTable.activeViewId()].settings?.condition_logical;
        filterConditions = {
            conditions,
            condition_logical: conditionLogical
        };
        if (!conditions || !conditions?.length) {
            return true;
        }
    }
    const { condition_logical, conditions } = filterConditions;
    if (condition_logical === AITableFilterLogical.and) {
        return conditions!.every((condition) => doFilterOperations(aiTable, fields, record, condition));
    }
    if (!condition_logical || condition_logical === AITableFilterLogical.or) {
        return conditions!.some((condition) => doFilterOperations(aiTable, fields, record, condition));
    }
    return false;
}

function doFilterOperations(aiTable: AIViewTable, fields: AITableViewFields, record: AITableRecord, condition: AITableFilterCondition) {
    const { field, cellValue } = getFilterValue(fields, record, condition);

    try {
        return (
            field &&
            doFilter(condition, cellValue, {
                aiTable,
                field
            })
        );
    } catch (error) {
        return false;
    }
}

export function doFilter(
    condition: AITableFilterCondition,
    cellValue: FieldValue,
    options: {
        aiTable: AITable;
        field: AITableField;
    }
) {
    const fieldModel = FieldModelMap[options.field.type];
    if (fieldModel && fieldModel.isValid(cellValue)) {
        return fieldModel.isMeetFilter(condition, cellValue, options);
    } else {
        if (condition.operation === AITableFilterOperation.empty) {
            return true;
        } else {
            return false;
        }
    }
}

export function getDefaultRecordDataByFilter(
    recordValues: Record<string, FieldValue>,
    conditions: AITableFilterCondition[],
    fields: AITableViewFields,
    conditionLogical?: AITableFilterLogical
) {
    const fieldMap = new Map<string, AITableViewField>(fields.map((field) => [field._id, field]));
    const conditionFieldCountMap = new Map<string, number>();
    conditions.forEach((condition) => {
        const fieldId = condition.field_id.toString();
        const tmpFieldCount = conditionFieldCountMap.get(fieldId) || 0;
        conditionFieldCountMap.set(fieldId, tmpFieldCount + 1);
    });
    if (conditionLogical === AITableFilterLogical.and) {
        conditions.forEach((condition) => {
            if (conditionFieldCountMap.get(condition.field_id.toString()) === 1) {
                const field = fieldMap.get(condition.field_id.toString())!;
                const canMultipleOperationCondition =
                    (!(field.settings as SelectSettings)?.is_multiple && condition.operation === AITableFilterOperation.eq) ||
                    (field?.settings as SelectSettings)?.is_multiple;
                if (
                    [AITableFilterOperation.eq, AITableFilterOperation.in].includes(condition.operation) &&
                    [AITableFieldType.select, AITableFieldType.member].includes(field?.type as AITableFieldType) &&
                    canMultipleOperationCondition
                ) {
                    recordValues[condition.field_id] = condition.value;
                }

                if (field?.type === AITableFieldType.date && condition.operation === AITableFilterOperation.eq) {
                    recordValues[condition.field_id] = {
                        timestamp: condition.value
                    };
                }

                if (condition.operation === AITableFilterOperation.contain && AITableFieldType.text === field?.type) {
                    recordValues[condition.field_id] = condition.value;
                }

                if (
                    condition.operation === AITableFilterOperation.eq &&
                    [AITableFieldType.rate, AITableFieldType.number, AITableFieldType.progress].includes(field?.type as AITableFieldType)
                ) {
                    recordValues[condition.field_id] = condition.value;
                }
            }
        });
    }
    return recordValues;
}

function getFilterValue(fields: AITableViewFields, record: AITableRecord, condition: AITableFilterCondition) {
    const field = fields.find((item) => item._id === condition.field_id);
    let cellValue = null;
    if (field && isSystemField(field)) {
        if ([AITableFieldType.createdAt, AITableFieldType.updatedAt].includes(field.type as AITableFieldType)) {
            cellValue = { timestamp: record[field.type as SystemFieldTypes] };
        } else {
            cellValue = record[field.type as SystemFieldTypes];
        }
    } else {
        cellValue = record.values[condition.field_id];
    }

    if (
        field &&
        [AITableFieldType.createdBy, AITableFieldType.updatedBy, AITableFieldType.member].includes(field.type as AITableFieldType)
    ) {
        cellValue = Array.isArray(cellValue) ? cellValue : isEmpty(cellValue) ? [] : [cellValue];
    }

    return {
        field,
        cellValue
    };
}
