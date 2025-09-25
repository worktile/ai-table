import { AIViewTable } from "../types";

interface PositionResult {
    position: number;
    needsRebalance: boolean;
    rebalanceReason?: string;
}

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

const DEFAULT_INITIAL_GAP = 65536;
const DEFAULT_PRECISION_THRESHOLD = 1;

export function insertAtStart(firstPosition: number, count: number = 1, initialGap: number = DEFAULT_INITIAL_GAP): PositionResult[] {
    const positions: PositionResult[] = [];
    for (let i = 0; i < count; i++) {
        positions.push({
            position: firstPosition - (count - i) * initialGap,
            needsRebalance: false
        });
    }
    return positions;
}

export function insertAtEnd(lastPosition: number, count: number = 1, initialGap: number = DEFAULT_INITIAL_GAP): PositionResult[] {
    const positions: PositionResult[] = [];
    for (let i = 0; i < count; i++) {
        positions.push({
            position: lastPosition + (i + 1) * initialGap,
            needsRebalance: false
        });
    }
    return positions;
}

export function insertBetween(prevPosition: number, nextPosition: number, count: number = 1, precisionThreshold: number = DEFAULT_PRECISION_THRESHOLD): PositionInsertResult {
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
            reason: `Insufficient precision: needed gap ${subGap}, but threshold is ${precisionThreshold}`
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
