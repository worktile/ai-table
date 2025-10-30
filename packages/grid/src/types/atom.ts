export enum AITableRenderAtomType {
    text = 'text',
    image = 'image',
    patch = 'patch',
    rect = 'rect',
    circle = 'circle'
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
}
