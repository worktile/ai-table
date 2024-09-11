import { FieldValue } from '@ai-table/grid';
import { AITableFilterCondition, AITableFilterOperation } from '../../types';
import { isEmpty } from '../common';

export abstract class Field {
    protected stringInclude(str: string, searchStr: string) {
        return str.toLowerCase().includes(searchStr.trim().toLowerCase());
    }

    isMeetFilter(condition: AITableFilterCondition, cellValue: FieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
            case AITableFilterOperation.exists: {
                return this.isEmptyOrNot(condition.operation, cellValue);
            }
            default: {
                return true;
            }
        }
    }

    isEmptyOrNot(operation: AITableFilterOperation.empty | AITableFilterOperation.exists, cellValue: FieldValue) {
        switch (operation) {
            case AITableFilterOperation.empty: {
                return isEmpty(cellValue);
            }
            case AITableFilterOperation.exists: {
                return !isEmpty(cellValue);
            }
            default: {
                throw new Error('compare operator type error');
            }
        }
    }
}
