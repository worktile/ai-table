import { isNil } from 'lodash';
import { DEFAULT_FIELD_STAT_TYPE_ITEMS } from '../../constants/field-stat';
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

    constructor(statTypes: AITableFieldStatTypeItemInfo[] = DEFAULT_FIELD_STAT_TYPE_ITEMS) {
        this.statTypes = statTypes;
        statTypes.forEach((item) => {
            this.statTypeMap.set(item.type, item);
        });
    }

    private stat(records: AITableRecords, options: FieldOptions) {
        const { field } = options;
        const exec = this.statTypeMap.get(field!.stat_type!)?.exec;
        if (exec) {
            return exec(records, options);
        }
        return null;
    }

    private statFormat(statValue: number, options: FieldOptions) {
        const { field } = options;
        const format = this.statTypeMap.get(field!.stat_type!)?.format;
        if (format) {
            return format.replace('{{statValue}}', statValue.toString());
        }
        return statValue.toString();
    }

    getStatFormatValue(records: AITableRecords, options: FieldOptions) {
        const statValue = this.stat(records, options);
        if (!isNil(statValue)) {
            return this.statFormat(statValue, options);
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
