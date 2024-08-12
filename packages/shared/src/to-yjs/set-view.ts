 
import { isObject } from "ngx-tethys/util";
import { AITableViewAction, SharedType } from "../types";
import { toSyncElement } from "../utils/init-shared";

export default function setView(sharedType: SharedType, action: AITableViewAction): SharedType {
    const views = sharedType.get('views');
    if (views) {
        const index = action.path[0];
        const targetView = views.get(index) as any;
        Object.entries(action.newView).forEach(([key, value]) => {
            if (value == null) {
                targetView.delete(key);
            } else if(isObject(value)){
                targetView.set(key, toSyncElement(value));
            }else{
                targetView.set(key,value);
            }
        });

        Object.entries(action.view).forEach(([key]) => {
            if (!action.newView.hasOwnProperty(key)) {
                targetView.delete(key);
            }
        });
    }
    return sharedType;
}
