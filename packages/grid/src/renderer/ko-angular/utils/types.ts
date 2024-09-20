import { KoShapeConfigTypes } from './config.types';

export type KoListenerRecord = Record<string, (value?: unknown) => void>;
export type KoPropsType = KoShapeConfigTypes & KoListenerRecord;
