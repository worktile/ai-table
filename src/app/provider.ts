import { LiveFeedProvider } from "./live-feed/feed-provider";
import { LiveFeedRoom } from "./live-feed/feed-room";

export const getProvider = (room: LiveFeedRoom, isDev: boolean) => {
    // 在线地址：wss://demos.yjs.dev/ws
    const prodUrl = `ws${location.protocol.slice(4)}//${location.host}/collaboration`;
    const devUrl = `ws${location.protocol.slice(4)}//${location.hostname}:3000`;
    const provider = new LiveFeedProvider(room, isDev ? devUrl : prodUrl);
    return provider;
};
