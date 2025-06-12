import ObjectID from 'bson-objectid';

export function idCreator() {
    return ObjectID().toHexString();
}
