import * as Y from "yjs";
import { toSharedType } from "./convert";
import { WebsocketProvider } from "y-websocket";

export const getSharedType = (
    initializeValue: any,
    isInitializeSharedType: boolean
) => {
    const doc = new Y.Doc();
    const sharedType = doc.getArray<any>("v-table");
    if (isInitializeSharedType) {
        toSharedType(sharedType, initializeValue as any);
    }
    const provider = new WebsocketProvider(
        "wss://demos.yjs.dev/ws",
        "demo-2024/06",
        doc
    );
    provider.connect();
    return sharedType;
};

// export function getSharedEditor(
//     editor: CursorBoard | TheEditor,
//     collaborationInfo: { uri: string; token: string },
//     slug: string,
//     user: MeInfo,
//     refetchToken: () => Observable<string>,
//     isInitializeSharedType: boolean,
//     initializeValue: WikiEditorDataType = []
// ) {
//     const doc = new Y.Doc();
//     const sharedDoc = doc.getArray<SyncElement>("content");
//     if (isInitializeSharedType) {
//         toSharedType(sharedDoc, initializeValue as any);
//     }

//     const provider = new WebsocketProvider(
//         collaborationInfo.uri,
//         refetchToken,
//         slug,
//         doc,
//         {
//             connect: false,
//             params: {
//                 token: collaborationInfo.token,
//                 client: doc.clientID,
//             },
//         }
//     );

//     editor.provider = provider;
//     const yjsEditor = withYjs(editor as Editor, sharedDoc, {
//         isSynchronizeValue: isInitializeSharedType,
//     });

//     connectProvider(yjsEditor, user);

//     return yjsEditor;
// }
