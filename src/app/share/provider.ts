import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

export const connectProvider = (doc: Y.Doc, room: string, isDev: boolean) => {
    // 在线地址：wss://demos.yjs.dev/ws
    const prodUrl = `ws${location.protocol.slice(4)}//${location.host}`;
    const devUrl = `ws${location.protocol.slice(4)}//${location.hostname}:3000`;
    const provider = new WebsocketProvider(isDev ? devUrl : prodUrl, room, doc);
    provider.connect();
    return provider;
};
