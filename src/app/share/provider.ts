import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

export const connectProvider = (doc: Y.Doc, isDev: boolean) => {
    // 在线地址：wss://demos.yjs.dev/ws
    const prodUrl = `ws${location.protocol.slice(4)}//${location.host}/collaboration`;
    const devUrl = `ws${location.protocol.slice(4)}//${location.hostname}:3000`;
    const provider = new WebsocketProvider(isDev ? devUrl : prodUrl, 'room-1', doc);
    provider.connect();
    return provider;
};
