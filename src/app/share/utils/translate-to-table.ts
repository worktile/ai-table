import { AITableFields, Path } from '@ai-table/grid';
import { SharedType } from '../shared';
import { DemoAIField, DemoAIRecord } from '../../types';
import { AITableView } from '../../types/view';

export const translateRecord = (arrayRecord: any[], fields: AITableFields) => {
    const fieldIds = fields.map((item) => item.id);
    const recordValue: Record<string, any> = {};
    fieldIds.forEach((item, index) => {
        recordValue[item] = arrayRecord[index] || '';
    });
    return recordValue;
};

export const translatePositions = (arrayPositions: any[], views: AITableView[]) => {
    const viewIds = views.map((item) => item.id);
    const positions: Record<string, number> = {};
    viewIds.forEach((item, index) => {
        positions[item] = arrayPositions[index] || 0;
    });
    return positions;
};


export const translateSharedTypeToTable = (sharedType: SharedType, views: AITableView[]) => {
    const data = sharedType.toJSON();
    const fields: DemoAIField[] = data['fields'];
    // TODO: views 支持协同后移除传入
    // const views: AITableView[] = data['fields'];
    const records: DemoAIRecord[] = data['records'].map((record: any) => {
        const [fixedField, customField, positions] = record;
        return {
            id: fixedField[0],
            values: translateRecord(customField, fields),
            positions: translatePositions(positions, views),
        };
    });
    return {
        records,
        fields
    };
};

export function toTablePath(path: (string | number)[]): Path {
    return path.filter((node) => typeof node === 'number') as Path;
}
