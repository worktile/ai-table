import { FieldBase } from './field';
import { DateFieldValue } from '../../types';
import { isEmpty } from '../../helps/is';

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

export function isDateAndReturnDate(input: any): Date | null {
    if (!input || isEmpty(input)) {
        return null;
    }
    if (input instanceof Date) {
        return input;
    }
    const value = input.trim();
    const datePattern = String.raw`(?:(\d{2}|\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})日?)`;
    const timePattern = String.raw`(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?`;

    const pattern = new RegExp(`^${datePattern}${timePattern}$`);
    const match = value.match(pattern);

    if (!match) {
        return null;
    }
    try {
        let [_, year, month, day] = match;

        if (year.length === 2) {
            const currentYear = new Date().getFullYear();
            const century = Math.floor(currentYear / 100) * 100;
            const twoDigitYear = parseInt(year);
            year = String(twoDigitYear > currentYear % 100 ? century - 100 + twoDigitYear : century + twoDigitYear);
        }

        const monthNum = parseInt(month);
        const dayNum = parseInt(day);

        if (monthNum < 1 || monthNum > 12) {
            console.warn('Invalid month:', monthNum);
            return null;
        }

        const maxDays = new Date(parseInt(year), monthNum, 0).getDate();
        if (dayNum < 1 || dayNum > maxDays) {
            console.warn('Invalid day:', dayNum);
            return null;
        }

        const standardDate = `${year}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        return new Date(standardDate);
    } catch (error) {
        console.warn('Invalid date:', value);
        return null;
    }
}

