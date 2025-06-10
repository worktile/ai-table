import { DragType } from '@ai-table/utils';
import { Coordinate } from '../coordinate';

export interface AITableDragState {
    type: DragType;
    sourceIds: Set<string>;
    coordinate?: Coordinate;
}
