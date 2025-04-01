import { KonvaEventObject } from 'konva/lib/Node';
import { KoComponent } from './component';
import { AITableTargetNameDetail } from '../../types';

export interface KoEventObject<T> {
    angularComponent: KoComponent;
    event: KonvaEventObject<T>;
}

export interface KoEventObjectOutput<T> extends KoEventObject<T> {
    targetNameDetail: AITableTargetNameDetail;
}
