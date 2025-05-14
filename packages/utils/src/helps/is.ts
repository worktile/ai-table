export function isUndefined(value: any): value is undefined {
    return value === undefined;
}

export function isNull(value: any): value is null {
    return value === null;
}

export function isUndefinedOrNull(value: any): value is undefined | null {
    return isUndefined(value) || isNull(value);
}

export function isEmpty(value: unknown): boolean {
    if (value === undefined) {
        return true;
    }

    if (value === null) {
        return true;
    }

    if (value === '') {
        return true;
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }

    return false;
}
