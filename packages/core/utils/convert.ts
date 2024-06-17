import * as Y from "yjs";

export type SyncElement = Y.Map<any>;
export type SharedType = Y.Array<SyncElement>;
export type SyncNode = SharedType | SyncElement;

export function toSharedType(sharedType: any, data: any): void {
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

    console.log("set", element);

    // Object.entries(node).forEach(([key, value]) => {
    //     if (key !== "children" && (!hasSetText || key !== "text")) {
    //         element.set(key, value);
    //     }
    // });

    return element;
}
