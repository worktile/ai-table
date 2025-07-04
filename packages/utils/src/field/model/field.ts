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
    AITableFieldStatTypeItemInfo,
    AITable
} from '../../types';
import { getI18nTextByKey } from '../../helps/i18n';

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
        const { field, aiTable } = options;
        const format = this.statTypeMap.get(field!.stat_type!)?.format;
        if (format) {
            const i18nText = getI18nTextByKey(aiTable, format);
            return i18nText.replace('{{statValue}}', statValue.toString());
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

    getStatTypes(aiTable: AITable) {
        return this.statTypes.map((statType) => {
            return {
                ...statType,
                name: getI18nTextByKey(aiTable, statType.name)
            };
        });
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
