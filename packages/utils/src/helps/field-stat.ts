import _ from 'lodash';
import { AITableRecord, AITableRecords, FieldStatOptions } from '../types';
import { isEmpty, numberFormat } from '.';

export function getFieldValue(record: AITableRecord, options: FieldStatOptions) {
    return options.getFieldValue ? options.getFieldValue(record, options) : record.values[options.field!._id];
}

export function getFieldValues(records: AITableRecords, options: FieldStatOptions, filterNull = false) {
    const result = _.map(records, (record) => {
        return getFieldValue(record, options);
    });
    if (filterNull) {
        return result.filter((value) => value !== null);
    }
    return result;
}

export function statCountAll(records: AITableRecords, options: FieldStatOptions) {
    return records.length;
}

export function statCountEmpty(records: AITableRecords, options: FieldStatOptions) {
    const { field } = options;
    return records.filter((record) => {
        const fieldValue = getFieldValue(record, options);
        if (isEmpty(fieldValue)) {
            return true;
        }
        return false;
    }).length;
}

export function statCountFilled(records: AITableRecords, options: FieldStatOptions) {
    return records.filter((record) => {
        const fieldValue = getFieldValue(record, options);
        if (isEmpty(fieldValue)) {
            return false;
        }
        return true;
    }).length;
}

export function statCountUnique(records: AITableRecords, options: FieldStatOptions) {
    records = records.filter((record) => {
        const fieldValue = getFieldValue(record, options);
        if (isEmpty(fieldValue)) {
            return false;
        }
        return true;
    });
    return _.uniqBy(records, (record) => {
        const fieldValue = getFieldValue(record, options);
        if (_.isArray(fieldValue)) {
            return fieldValue.join(',');
        }
        if (_.isObject(fieldValue)) {
            return JSON.stringify(fieldValue);
        }
        return fieldValue;
    }).length;
}

export function statPercentFilled(records: AITableRecords, options: FieldStatOptions) {
    const filledCount = statCountFilled(records, options);
    const allCount = statCountAll(records, options);
    return numberFormat((filledCount / allCount) * 100);
}

export function statPercentEmpty(records: AITableRecords, options: FieldStatOptions) {
    const emptyCount = statCountEmpty(records, options);
    const allCount = statCountAll(records, options);
    return numberFormat((emptyCount / allCount) * 100);
}

export function statPercentUnique(records: AITableRecords, options: FieldStatOptions) {
    const uniqueCount = statCountUnique(records, options);
    const countAll = statCountAll(records, options);
    return numberFormat((uniqueCount / countAll) * 100);
}

export function statSum(records: AITableRecords, options: FieldStatOptions) {
    const values = getFieldValues(records, options, true);
    return numberFormat(_.sum(values));
}

export function statMax(records: AITableRecords, options: FieldStatOptions) {
    const values = getFieldValues(records, options, true);
    return numberFormat(_.maxBy(values));
}

export function statMin(records: AITableRecords, options: FieldStatOptions) {
    const values = getFieldValues(records, options, true);
    return numberFormat(_.minBy(values));
}

export function statAverage(records: AITableRecords, options: FieldStatOptions) {
    const values = getFieldValues(records, options, true);
    return numberFormat(_.mean(values));
}
