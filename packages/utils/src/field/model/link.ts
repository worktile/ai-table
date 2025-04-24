import { isNil } from 'lodash';
import { FieldBase } from './field';
import { LinkFieldValue } from '../../types';

export const isLinkValid = (cellValue: LinkFieldValue): cellValue is LinkFieldValue => {
    return (cellValue && typeof cellValue === 'object' && 'url' in cellValue && 'text' in cellValue) || cellValue === null;
};

export class LinkFieldBase extends FieldBase {
    override isValid(cellValue: LinkFieldValue): boolean {
        return isLinkValid(cellValue);
    }

    override cellFullText(transformValue: LinkFieldValue): string[] {
        let texts: string[] = [];
        if (!isNil(transformValue)) {
            texts.push(transformValue.text);
        }
        return texts;
    }
}
