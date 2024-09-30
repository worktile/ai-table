import { InjectionToken } from '@angular/core';
import { THY_NOTIFY_DEFAULT_CONFIG } from 'ngx-tethys/notify';

export const KO_CONTAINER_TOKEN = new InjectionToken<any>('KO_CONTAINER_TOKEN');

export const AI_TABLE_NOTIFY_CONFIG = {
    provide: THY_NOTIFY_DEFAULT_CONFIG,
    useValue: {
        offset: '20',
        duration: 4500,
        pauseOnHover: true,
        maxStack: 8,
        placement: 'bottomLeft'
    }
};
