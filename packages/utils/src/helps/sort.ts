import { AITableView, AITableViewFields, AITableViewRecords } from "../types/view";

export const sortByViewPosition = (data: AITableViewRecords | AITableViewFields, activeView: AITableView) => {
    const hasPositions = data.every((item) => item.positions && item.positions);
    if (hasPositions) {
        return [...data].sort((a, b) => a.positions[activeView._id] - b.positions[activeView._id]);
    }
    return data;
};