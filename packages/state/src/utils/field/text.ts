import { isEmpty } from '../common';
import { AITableFilterCondition, AITableFilterOperation } from '../../types';
import { Field } from './field';
import { FieldValue } from '@ai-table/grid';

export class TextField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<string>, cellValue: FieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellValue);
            case AITableFilterOperation.contain:
                return !isEmpty(cellValue) && this.stringInclude(cellValue, condition.value);
            default:
                return super.isMeetFilter(condition, cellValue);
        }
    }

    static stringInclude(str: string, searchStr: string) {
        return str.toLowerCase().includes(searchStr.trim().toLowerCase());
    }
}
