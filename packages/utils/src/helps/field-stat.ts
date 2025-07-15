import _ from 'lodash';
import { isEmpty } from '../public-api';
import { AITableField, AITableRecords, FieldOptions } from '../types';

export function getFieldValues(records: AITableRecords, field: AITableField, filterNull = false) {
    const result = _.map(records, (record) => {
        return record.values[field._id];
    });
    if (filterNull) {
        return result.filter((value) => value !== null);
    }
    return result;
}

export function statCountAll(records: AITableRecords, options: FieldOptions) {
    return records.length;
}

export function statCountEmpty(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    return records.filter((record) => {
        const fieldValue = record.values[field!._id];
        if (isEmpty(fieldValue)) {
            return true;
        }
        return false;
    }).length;
}

export function statCountFilled(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    return records.filter((record) => {
        const fieldValue = record.values[field!._id];
        if (isEmpty(fieldValue)) {
            return false;
        }
        return true;
    }).length;
}

export function statCountUnique(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    records = records.filter((record) => {
        const fieldValue = record.values[field!._id];
        if (!fieldValue || isEmpty(fieldValue)) {
            return false;
        }
        return true;
    });
    return _.uniqBy(records, (record) => {
        const fieldValue = record.values[field!._id];
        if (_.isArray(fieldValue)) {
            return fieldValue.join(',');
        }
        return fieldValue;
    }).length;
}

export function statPercentFilled(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    const filledCount = statCountFilled(records, options);
    const allCount = statCountAll(records, options);
    return ((filledCount / allCount) * 100).toFixed(2);
}

export function statPercentEmpty(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    const emptyCount = statCountEmpty(records, options);
    const allCount = statCountAll(records, options);
    return ((emptyCount / allCount) * 100).toFixed(2);
}

export function statPercentUnique(records: AITableRecords, options: FieldOptions) {
    const uniqueCount = statCountUnique(records, options);
    const filledCount = statCountFilled(records, options);
    return ((uniqueCount / filledCount) * 100).toFixed(2);
}

export function statSum(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    const values = getFieldValues(records, field!, true);
    return _.sum(values);
}

export function statMax(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    const values = getFieldValues(records, field!, true);
    return _.maxBy(values);
}

export function statMin(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    const values = getFieldValues(records, field!, true);
    return _.minBy(values);
}

export function statAverage(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    const values = getFieldValues(records, field!, true);
    return _.mean(values).toFixed(2);
}
