import { Vector2d } from 'konva/lib/types';
import { DragType } from '@ai-table/utils';
import { Coordinate } from '../coordinate';

export interface AITableDragState {
    type: DragType;
    sourceIds: Set<string>;
    scroll?: Vector2d;
    coordinate?: Coordinate;
}
