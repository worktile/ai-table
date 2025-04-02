import { Path } from '@ai-table/grid';
import { AITableView, AITableViewFields, AITableViewRecords } from '../types';

export function isPathEqual(path: Path, another: Path): boolean {
    return path.length === another.length && path.every((n, i) => n === another[i]);
}

export function sortByViewPosition(data: AITableViewRecords | AITableViewFields, activeView: AITableView) {
    const hasPositions = data.every((item) => item.positions && item.positions);
    if (hasPositions) {
        return [...data].sort((a, b) => a.positions[activeView._id] - b.positions[activeView._id]);
    }
    return data;
}

export function generateCopyName(existNames: string[], name: string) {
    let newName = `${name} 副本`;
    let index = 2;
    while (existNames.includes(newName)) {
        newName = `${name} 副本 ${index}`;
        index++;
    }
    return newName;
}
