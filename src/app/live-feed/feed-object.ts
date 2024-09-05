import * as Y from 'yjs';

export const convertYDocToFeedObject = (yDoc: Y.Doc, typeName: string) => {
    const feedObject = yDoc as LiveFeedObject;
    feedObject.typeName = typeName;
    return feedObject;
};

export class LiveFeedObject extends Y.Doc {
    typeName?: string;

    constructor(options: { guid?: string; typeName: string }) {
        super({ guid: options.guid });
        this.typeName = options.typeName;
    }

    // 检测数据变化，如果发现新增文档则需要将新增的文档转换为 feed-object （调用 convertYDocToFeedObject）
    // 然后调用 room 的 addObject 方法，将对象添加到房间内，整体管理
}

