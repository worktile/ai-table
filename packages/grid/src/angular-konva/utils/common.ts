import { EventEmitter } from '@angular/core';
import { KoComponent } from '../interfaces/component';
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
        'koMouseover',
        'koMousemove',
        'koMouseout',
        'koMouseenter',
        'koMouseleave',
        'koMousedown',
        'koMouseup',
        'koWheel',
        'koContextmenu',
        'koClick',
        'koDblclick',
        'koTouchstart',
        'koTouchmove',
        'koTouchend',
        'koTap',
        'koDbltap',
        'koDragstart',
        'koDragmove',
        'koDragend'
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
