import { isEmpty } from '../../helps';
import { ProgressFieldValue } from '../../types';
import { FieldBase } from './field';

export class ProgressFieldBase extends FieldBase {
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
export function isProgress(input: string, isMustIncludePercent: boolean = false) {
    let value;
    const progressRegex = /^(?:100|[1-9]?\d(?:\.\d+)?)\s*%$/;
    if(progressRegex.test(input)) {
        value = parseFloat(input);
    }
    else if (!isMustIncludePercent && progressRegex.test(`${input}%`)) {
        value = parseFloat(`${input}%`);
    }
    if (!isEmpty(value)) {
        let progressValue = Number(value);
        if (!Number.isNaN(progressValue)) {
            progressValue = Math.round(progressValue);
            if (progressValue >= 0 && progressValue <= 100) {
                return true;
            }
        }
        return false;
    }
    return false;
}