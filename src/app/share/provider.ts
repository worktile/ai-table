import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

export const connectProvider = (doc: Y.Doc) => {
    const provider = new WebsocketProvider('wss://demos.yjs.dev/ws', 'ai-table-demo-2024/7/25', doc);
    provider.connect();
    return provider;
};
