import Konva from 'konva';
import { AITableRect, AITableImage, AITableText } from '@ai-table/grid';
import { RectConfig } from 'konva/lib/shapes/Rect';
import { TextConfig } from 'konva/lib/shapes/Text';
import { ImageConfig } from 'konva/lib/shapes/Image';

export enum AITableCustomFieldType {
    relationTicket = 'relation_ticket'
}

export interface RelationItem {
    bgRect: AITableRect;
    icon: Pick<AITableImage, 'x' | 'y' | 'width' | 'height' | 'url'>;
    identifier: AITableText;
    title: AITableText;
    relationInfo: AITableRelationInfo;
}

export interface MoreCountItem {
    bgRect: AITableRect;
    text: AITableText;
}

export interface AITableRelationInfo {
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

export interface AITableRelationConfig extends Konva.ShapeConfig {
    bgRect: RectConfig;
    icon: ImageConfig;
    identifier: TextConfig;
    title: TextConfig;
    relationInfo: AITableRelationInfo;
}
