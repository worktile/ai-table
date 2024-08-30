import { AITableView, AITableViewFields, AITableViewRecords, Positions } from "../types";

export function createDefaultPositions(views: AITableView[], activeId: string, data: AITableViewRecords | AITableViewFields, index: number) {
    const positions: Positions = {};
    const position = getPosition(data, activeId, index);
    const maxPosition = data[data.length - 1].positions[activeId];
    views.forEach((element) => {
        positions[element._id] = element._id === activeId ? position : maxPosition + 1;
    });
    return positions;
}

export function getPosition(data: AITableViewRecords | AITableViewFields, activeViewId: string, index: number) {
    let position = data.length - 1;
    if (index !== 0 && index !== data.length) {
        const previousViewPosition = data[index - 1].positions[activeViewId];
        const nextViewPosition = data[index].positions[activeViewId!];
        position = (previousViewPosition + nextViewPosition) / 2;
    } else {
        position = index;
    }
    return position;
}