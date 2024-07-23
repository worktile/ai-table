import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

export const connectProvider = (doc: Y.Doc) => {
    const provider = new WebsocketProvider('wss://demos.yjs.dev/ws', 'ai-table-2024/7', doc);
    provider.connect();
    return provider;
};
