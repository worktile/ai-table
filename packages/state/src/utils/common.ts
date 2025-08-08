import { AITableView, AITableViewFields, AITableViewRecords, Path } from '@ai-table/utils';
import { AITable } from '@ai-table/grid';
import { AITableStateI18nKey, getStateI18nTextByKey } from './i18n';

export function isPathEqual(path: Path, another: Path): boolean {
    return path.length === another.length && path.every((n, i) => n === another[i]);
}

export function generateCopyName(aiTable: AITable, existNames: string[], name: string) {
    const copyText = getStateI18nTextByKey(aiTable, AITableStateI18nKey.copySuffix);
    let newName = `${name} ${copyText}`;
    let index = 2;
    while (existNames.includes(newName)) {
        newName = `${name} ${copyText} ${index}`;
        index++;
    }
    return newName;
}
