import * as Y from "yjs";
import { SyncElement, toVTableNode } from "../convert";

/**
 * Translates a Yjs text event into a slate operations.
 *
 * @param event
 */
export default function translateEvent(events: Y.YEvent<any>[]): any {
    return events
        .map((event: any) => {
            if (event instanceof Y.YArrayEvent) {
                const actions: any[] | null = [];
                let offset = 0;
                event.changes.delta.forEach((delta) => {
                    if ("retain" in delta) {
                        offset += delta.retain ?? 0;
                    }

                    if ("insert" in delta) {
                        const toInsert = (delta.insert as any).map(
                            (item: SyncElement) => toVTableNode(item)
                        );
                        toInsert.forEach((node: any) => {
                            actions.push({
                                type: node.type,
                                data: {
                                    index: offset,
                                    value: node.data,
                                },
                            });
                        });
                    }
                });
                return actions;
            }
            if (event instanceof Y.YMapEvent) {
                const keyChanges = Array.from(event.changes.keys.entries());
                const newProperties = Object.fromEntries(
                    keyChanges.map(([key, info]) => {
                        console.log(key, event.target.get(key))
                        return [
                            key,
                            info.action === "delete" ? null : event.target.get(key),
                        ]
                    })
                );
               console.log(newProperties);
                return Object.values(newProperties);
            }
            return null;
        })
        .filter((item) => !!item);
}


   // events.forEach((event: any) => {
                //     if (event instanceof Y.YMapEvent) {
                //         const keyChanges = Array.from(
                //             event.changes.keys.entries()
                //         );
                //         const newProperties = Object.fromEntries(
                //             keyChanges.map(([key, info]) => [
                //                 key,
                //                 info.action === "delete"
                //                     ? null
                //                     : event.target.get(key),
                //             ])
                //         );
                //         if (YjsVTable.isUndo(this.value)) {
                //             Object.values(newProperties).map((item) => {
                //                 this.actionManager.execute({
                //                     type: item.type,
                //                     recordId: item.recordId,
                //                     fieldId: item.fieldId,
                //                     data: item.data,
                //                     previousData: item.previousData,
                //                 });
                //             });
                //         } else {
                //             YjsVTable.asRemote(this.value, () => {
                //                 Object.values(newProperties).map((item) => {
                //                     this.actionManager.execute({
                //                         type: item.type,
                //                         recordId: item.recordId,
                //                         fieldId: item.fieldId,
                //                         data: item.data,
                //                         previousData: item.previousData,
                //                     });
                //                 });
                //             });
                //         }
                //     }
                // });