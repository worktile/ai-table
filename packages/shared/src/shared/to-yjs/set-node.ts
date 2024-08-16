import { getSharedMapValueIndex } from '../utils';
import { SetViewAction, SharedType, SyncMapElement, ViewActionName } from '../../types';
import { ActionName, SetFieldAction } from '@ai-table/grid';

export default function setMapNode(sharedType: SharedType, action: SetFieldAction | SetViewAction): SharedType {
    let sharedNodes;
    if (action.type === ActionName.SetField) {
        sharedNodes = sharedType.get('fields')!;
    }

    if (action.type === ViewActionName.setView) {
        sharedNodes = sharedType.get('views')!;
    }

    if (sharedNodes) {
        let nodeIndex = getSharedMapValueIndex(sharedNodes, action.path[0] as string);
        if (nodeIndex > -1) {
            const node = sharedNodes.get(nodeIndex) as SyncMapElement;
            Object.entries(action.newProperties).forEach(([key, value]) => {
                if (value == null) {
                    node.delete(key);
                } else {
                    node.set(key, value);
                }
            });
            Object.entries(action.properties).forEach(([key]) => {
                if (!action.newProperties.hasOwnProperty(key)) {
                    node.delete(key);
                }
            });
        }
    }
    return sharedType;
}
