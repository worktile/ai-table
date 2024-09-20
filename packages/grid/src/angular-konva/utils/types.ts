import { KoShapeConfigTypes } from '../interfaces/config';

export type KoListenerRecord = Record<string, (value?: unknown) => void>;
export type KoPropsType = KoShapeConfigTypes & KoListenerRecord;
