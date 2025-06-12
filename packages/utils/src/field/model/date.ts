import { FieldBase } from './field';
import { DateFieldValue } from '../../types';

export const isDateValid = (cellValue: DateFieldValue): cellValue is DateFieldValue => {
    return (
        (cellValue && typeof cellValue === 'object' && 'timestamp' in cellValue && typeof cellValue.timestamp === 'number') ||
        cellValue === null
    );
};

export class DateFieldBase extends FieldBase {
    override isValid(cellValue: DateFieldValue): boolean {
        return isDateValid(cellValue);
    }
}
