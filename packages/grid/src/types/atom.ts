export enum AITableRenderAtomType {
    text = 'text',
    image = 'image',
    patch = 'patch',
    rect = 'rect',
    circle = 'circle',
    avatar = 'avatar'
}

export interface AITableRenderAtom {
    type: AITableRenderAtomType;
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    text?: string;
    fontSize?: number;
    fillStyle?: string;
    alpha?: number;
    // avatar
    uid?: string;
    url?: string;
    title?: string;
    bgColor?: string;
    image?: string;
}
