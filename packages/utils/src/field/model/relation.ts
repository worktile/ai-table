import { AITableField, AITableReferences, AttachmentFieldValue } from '../../types';
import { FieldBase } from './field';

export class RelationFieldBase extends FieldBase {
    override isValid(cellValue: AttachmentFieldValue): boolean {
        return Array.isArray(cellValue) || cellValue === null;
    }

    override cellFullText(transformValue: string[], field: AITableField, references?: AITableReferences): string[] {
        let fullText: string[] = [];
        if (transformValue?.length && references) {
            for (let index = 0; index < transformValue.length; index++) {
                const attachmentInfo = references?.attachments[transformValue[index]];
                if (!attachmentInfo) {
                    continue;
                }
                if (attachmentInfo.title) {
                    fullText.push(attachmentInfo.title);
                }
            }
        }
        return fullText;
    }
}
