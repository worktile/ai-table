import * as Y from "yjs";

export type SyncElement = Y.Map<any>;
export type SharedType = Y.Array<SyncElement>;
export type SyncNode = SharedType | SyncElement;

export function toSharedType(sharedType: any, data: any): void {
    // recordId
    // id
    // type
    sharedType.insert(0, data.rows.map(toSyncElement));
}

export function toSyncElement(node: any): SyncElement {
    const element: SyncElement = new Y.Map();
    for (const key in node) {
        if (typeof node[key] === "object") {
            for (const dataKey in node[key]) {
                const value = new Y.Text(node[key][dataKey]);
                element.set(dataKey, value);
            }
        } else {
            const data = new Y.Text(node[key]);
            element.set(key, data);
        }
    }
    return element;
}

export function toVTableNode(element: SyncElement) {
    const values = SyncElement.getValues(element);
    return values!.reduce(
        (acc: any, obj) => {
            const [key, value] = Object.entries(obj)[0];
            if (key === "type") {
                acc.type = value;
            } else if (key === "id") {
                acc.data.id = value;
            } else {
                acc.data.value[key] = value;
            }
            return acc;
        },
        { data: { value: {} } }
    );
}

export const SyncElement = {
    getValues(element: SyncElement): { [key: string]: Y.Text }[] | undefined {
        return Array.from(element._map.keys()).map((item) => {
            return {
                [item]: element.get(item).toString(),
            };
        });
    },
};
