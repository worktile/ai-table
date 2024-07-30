import { AIViewAction } from "../../types/view";
import { SharedType,  toSyncElement } from "../shared";

export default function setView(sharedType: SharedType, action: AIViewAction): SharedType {
    const views = sharedType.get('views');
    if (views) {
        const index = action.path[0];
        views.delete(index);
        views.insert(index, [toSyncElement(action.newView)]);
    }

    return sharedType;
}
