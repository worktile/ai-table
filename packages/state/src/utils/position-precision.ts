interface PositionInsertResult {
    success: boolean;
    positions: number[];
    needsReorganization: boolean;
    reason?: string;
    context?: {
        prevPosition: number;
        nextPosition: number;
        availableGap: number;
        subGap: number;
        requestedCount: number;
    };
}

export const DEFAULT_INITIAL_GAP = 65536;
export const DEFAULT_PRECISION_THRESHOLD = 1;

export function insertAtStart(firstPosition: number, count: number = 1, initialGap: number = DEFAULT_INITIAL_GAP): number[] {
    const positions: number[] = [];
    for (let i = 0; i < count; i++) {
        positions.push(firstPosition - (count - i) * initialGap);
    }
    return positions;
}

export function insertAtEnd(lastPosition: number, count: number = 1, initialGap: number = DEFAULT_INITIAL_GAP): number[] {
    const positions: number[] = [];
    for (let i = 0; i < count; i++) {
        positions.push(lastPosition + (i + 1) * initialGap);
    }
    return positions;
}

export function insertBetween(
    prevPosition: number,
    nextPosition: number,
    count: number = 1,
    precisionThreshold: number = DEFAULT_PRECISION_THRESHOLD
): PositionInsertResult {
    const gap = nextPosition - prevPosition;

    if (gap <= 0) {
        return {
            success: false,
            positions: [],
            needsReorganization: true,
            reason: `Invalid gap: ${gap}, previous position ${prevPosition} must be less than next position ${nextPosition}`
        };
    }

    const subGap = gap / (count + 1);

    if (subGap < precisionThreshold) {
        return {
            success: false,
            positions: [],
            needsReorganization: true,
            reason: `Insufficient precision: current gap ${subGap}, but threshold is ${precisionThreshold}`
        };
    }

    const positions: number[] = [];
    for (let i = 0; i < count; i++) {
        positions.push(prevPosition + (i + 1) * subGap);
    }

    return {
        success: true,
        positions,
        needsReorganization: false,
        context: {
            prevPosition,
            nextPosition,
            availableGap: gap,
            subGap,
            requestedCount: count
        }
    };
}
