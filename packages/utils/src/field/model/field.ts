import { isNil } from 'lodash';
import { FIELD_STAT_DEFAULT_MENUS } from '../../constants/field-stat';
import { isEmpty } from '../../helps';
import {
    AITableFieldStatType,
    AITableField,
    AITableRecords,
    AITableReferences,
    AITableStatType,
    FieldOptions,
    FieldValue,
    AITableFieldStatTypeItemInfo
} from '../../types';

export abstract class FieldBase {
    public statTypeMap: Map<AITableFieldStatType, AITableFieldStatTypeItemInfo> = new Map();

    public statTypes: AITableFieldStatTypeItemInfo[] = [];

    abstract isValid(cellValue: FieldValue): boolean;

    constructor(statTypes: AITableFieldStatTypeItemInfo[] = FIELD_STAT_DEFAULT_MENUS) {
        this.statTypes = statTypes;
        statTypes.forEach((item) => {
            this.statTypeMap.set(item.type, item);
        });
    }

    private stat(field: AITableField, records: AITableRecords) {
        const exec = this.statTypeMap.get(field.stat_type!)?.exec;
        if (exec) {
            return exec(records, field);
        }
        return null;
    }

    private statFormat(statValue: number, field: AITableField) {
        const format = this.statTypeMap.get(field.stat_type!)?.format;
        if (format) {
            return format.replace('{{statValue}}', statValue.toString());
        }
        return statValue.toString();
    }

    getStatFormatValue(field: AITableField, records: AITableRecords) {
        const statValue = this.stat(field, records);
        if (!isNil(statValue)) {
            return this.statFormat(statValue, field);
        }
        return null;
    }

    transformCellValue(cellValue: FieldValue, options: FieldOptions): FieldValue | null {
        if (!this.isValid(cellValue)) {
            return null;
        }
        return cellValue;
    }

    cellFullText(transformValue: any, field: AITableField, references?: AITableReferences): string[] {
        let fullText: string[] = [];
        if (!isEmpty(transformValue)) {
            fullText.push(String(transformValue));
        }
        return fullText;
    }
}
