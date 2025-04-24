import { Dictionary } from 'lodash';

export interface AITableAttachmentInfo {
    _id: string;
    title: string;
    addition: {
        ext: string;
        summary?: string;
        size?: number;
        path?: string;
        [key: string]: any;
    };
    token?: string;
    [key: string]: any;
}

export interface AITableUserInfo {
    uid?: string;
    display_name?: string;
    avatar?: string;
    [key: string]: any;
}

export interface AITableReferences {
    members: Dictionary<AITableUserInfo>;
    attachments: Dictionary<AITableAttachmentInfo>;
}
