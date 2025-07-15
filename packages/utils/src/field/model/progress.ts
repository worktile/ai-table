import { DEFAULT_FIELD_STAT_TYPE_ITEMS, DEFAULT_FIELD_STAT_TYPE_MAP } from '../../constants';
import { isEmpty } from '../../helps';
import { AITableStatType, ProgressFieldValue } from '../../types';
import { FieldBase } from './field';

export class ProgressFieldBase extends FieldBase {
    constructor() {
        super([
            ...DEFAULT_FIELD_STAT_TYPE_ITEMS,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Max]!,
            DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Min]!
        ]);
    }
    override isValid(cellValue: ProgressFieldValue): boolean {
        return typeof cellValue === 'number' || cellValue === null;
    }

    override cellFullText(transformValue: ProgressFieldValue): string[] {
        let fullText: string[] = [];
        if (!isEmpty(transformValue)) {
            fullText.push(`${transformValue}%`);
        }
        return fullText;
    }
}
export function isProgressAndReturnValue(input: string, isMustIncludePercent: boolean = false) {
    let value;
    const progressRegex = /^(?:100|[1-9]?\d(?:\.\d+)?)\s*%$/;
    if (progressRegex.test(input)) {
        value = parseFloat(input);
    } else if (!isMustIncludePercent && progressRegex.test(`${input}%`)) {
        value = parseFloat(`${input}%`);
    }
    if (!isEmpty(value)) {
        let progressValue = Number(value);
        if (!Number.isNaN(progressValue)) {
            if (progressValue > 1) {
                progressValue = Math.round(progressValue);
                if (progressValue >= 0 && progressValue <= 100) {
                    return progressValue;
                }
            } else if (progressValue >= 0 && progressValue <= 1) {
                return Math.round(progressValue * 100);
            } else {
                return null;
            }
        }
        return null;
    }
    return null;
}
