import { KonvaEventObject } from 'konva/lib/Node';
import { KoComponent } from './ko-component';

export interface KoEventObject<T> {
    angularComponent: KoComponent;
    event: KonvaEventObject<T>;
}
