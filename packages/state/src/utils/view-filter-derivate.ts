import { AITableRecord, FieldValue } from '@ai-table/grid';
import { ViewOperationMap } from './field';
import {
    AITableFilterCondition,
    AITableFilterConditions,
    AITableFilterLogical,
    AITableFilterOperation,
    AITableView,
    AITableViewField,
    AITableViewFields,
    AITableViewRecords
} from '../types';

export function getFilteredRecords(records: AITableViewRecords, fields: AITableViewFields, activeView: AITableView) {
    const { conditions, condition_logical } = activeView.settings || {};
    if (!conditions) {
        return records;
    }
    const illegalConditions = conditions.filter((item) => item.operation) || [];
    if (!illegalConditions.length) {
        return records;
    }
    return records.filter((record) => {
        return checkConditions(fields, record, { conditions: illegalConditions, condition_logical });
    });
}

function checkConditions(fields: AITableViewFields, record: AITableRecord, filterConditions: AITableFilterConditions) {
    if (!record) {
        return false;
    }
    if (!filterConditions?.conditions) {
        return true;
    }
    const { condition_logical, conditions } = filterConditions;
    if (condition_logical === AITableFilterLogical.and) {
        return conditions.every((condition) => doFilterOperations(fields, record, condition));
    }
    if (!condition_logical || condition_logical === AITableFilterLogical.or) {
        return conditions.some((condition) => doFilterOperations(fields, record, condition));
    }
    return false;
}

function doFilterOperations(fields: AITableViewFields, record: AITableRecord, condition: AITableFilterCondition) {
    const field = fields.find((item) => item._id === condition.field_id);
    const cellValue = record.values[condition.field_id];
    try {
        return field && doFilter(condition, field, cellValue);
    } catch (error) {
        return false;
    }
}

export function doFilter(condition: AITableFilterCondition, field: AITableViewField, cellValue: FieldValue) {
    if (condition.operation === AITableFilterOperation.empty) {
        return cellValue === null;
    }
    if (condition.operation === AITableFilterOperation.exists) {
        return cellValue !== null;
    }

    return ViewOperationMap[field.type].isMeetFilter(condition, cellValue);
}
