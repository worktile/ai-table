import { AITableFieldOption } from '@ai-table/utils';
import { AITable } from '../types';
import { isSameFieldOption } from './field';

export function generateNewName(existNames: string[], count: number, name: string) {
    let newName = name;
    let suffix = count;

    if (count > 1) {
        newName = `${name} ${suffix}`;
    }

    while (existNames.includes(newName)) {
        suffix++;
        newName = `${name} ${suffix}`;
    }
    return newName;
}

export function generateNewFieldName(
    aiTable: AITable,
    field: Pick<AITableFieldOption, 'type' | 'settings'>,
    name: string,
    existNames?: string[]
) {
    existNames = existNames || aiTable.fields().map((item) => item.name);
    const count = aiTable.fields().filter((item) => {
        return isSameFieldOption(field, item);
    }).length;
    return generateNewName(existNames, count, name);
}
