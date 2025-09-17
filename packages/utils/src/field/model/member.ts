import { AITableField, AITableReferences, MemberFieldValue } from '../../types';
import { FieldBase } from './field';

export class MemberFieldBase extends FieldBase {
    override isValid(cellValue: MemberFieldValue): boolean {
        return Array.isArray(cellValue) || cellValue === null;
    }

    override cellFullText(transformValue: string[], field: AITableField, references?: AITableReferences): string[] {
        let fullText: string[] = [];
        if (transformValue?.length && references) {
            for (let index = 0; index < transformValue.length; index++) {
                const userInfo = references?.members[transformValue[index]];
                if (!userInfo) {
                    continue;
                }
                if (userInfo.display_name) {
                    fullText.push(userInfo.display_name);
                }
            }
        }
        return fullText;
    }

    getDefaultValue() {
        return [];
    }
}
