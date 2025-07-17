import _ from 'lodash';
import { AITableField, AITableRecords, FieldOptions } from '../types';
import { isEmpty, numberFormat } from '.';

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
    return numberFormat((filledCount / allCount) * 100);
}

export function statPercentEmpty(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    const emptyCount = statCountEmpty(records, options);
    const allCount = statCountAll(records, options);
    return numberFormat((emptyCount / allCount) * 100);
}

export function statPercentUnique(records: AITableRecords, options: FieldOptions) {
    const uniqueCount = statCountUnique(records, options);
    const filledCount = statCountFilled(records, options);
    return numberFormat((uniqueCount / filledCount) * 100);
}

export function statSum(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    const values = getFieldValues(records, field!, true);
    return numberFormat(_.sum(values));
}

export function statMax(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    const values = getFieldValues(records, field!, true);
    return numberFormat(_.maxBy(values));
}

export function statMin(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    const values = getFieldValues(records, field!, true);
    return numberFormat(_.minBy(values));
}

export function statAverage(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    const values = getFieldValues(records, field!, true);
    return numberFormat(_.mean(values));
}
