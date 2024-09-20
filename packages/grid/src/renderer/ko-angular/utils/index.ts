import { EventEmitter } from '@angular/core';
import { KoComponent } from '../interfaces/ko-component';
import applyNodeProps from './apply-node-props';
import { KoListenerRecord } from './types';
import updatePicture from './update-picture';

function camelize(str: string): string {
    return str
        .replace(/^\w|[A-Z]|\b\w/g, function (letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        })
        .replace(/\s+/g, '');
}

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getName(componentTag: string): string {
    return capitalizeFirstLetter(camelize(componentTag.slice(3).replace('-', ' ')));
}

export function createListener(instance: KoComponent): KoListenerRecord {
    const output: KoListenerRecord = {};
    [
        'onMouseover',
        'onMousemove',
        'onMouseout',
        'onMouseenter',
        'onMouseleave',
        'onMousedown',
        'onMouseup',
        'onWheel',
        'onContextmenu',
        'onClick',
        'onDblclick',
        'onTouchstart',
        'onTouchmove',
        'onTouchend',
        'onTap',
        'onDbltap',
        'onDragstart',
        'onDragmove',
        'onDragend'
    ].forEach((eventName) => {
        const name: keyof KoComponent = <keyof KoComponent>eventName;

        const eventEmitter: EventEmitter<unknown> = <EventEmitter<unknown>>instance[name];
        if (eventEmitter.observed) {
            output[eventName] = eventEmitter.emit.bind(eventEmitter);
        }
    });
    return output;
}

export { applyNodeProps, updatePicture };
