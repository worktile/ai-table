import { insertBetween } from './position';

describe('Position utils', () => {
    describe('连续插入测试', () => {
        function testMaxInsertions(precisionThreshold: number | undefined, expectedCount: number, count: number = 1) {
            let prevPosition = 0;
            let nextPosition = 65536;
            let maxInsertions = 0;
            
            while (true) {
                // 根据是否提供精度阈值来调用insertBetween
                const result = precisionThreshold !== undefined
                    ? insertBetween(prevPosition, nextPosition, count, precisionThreshold)
                    : insertBetween(prevPosition, nextPosition, count);
                    
                if (result.success) {
                    nextPosition = result.positions[result.positions.length - 1];
                    maxInsertions++;
                } else {
                    break;
                }
            }
            
            console.log(`使用精度阈值${precisionThreshold !== undefined ? precisionThreshold : '默认值'}时，能够连续插入的最大次数为: ${maxInsertions}`);
            expect(maxInsertions).toEqual(expectedCount);
        }
        
        it('测试 DEFAULT_INITIAL_GAP = 65536, DEFAULT_PRECISION_THRESHOLD = 0.01 的连续插入次数', () => {
            // 使用默认精度阈值（在position.ts中定义）
            testMaxInsertions(undefined, 22);
        });

        it('测试 DEFAULT_INITIAL_GAP = 65536, DEFAULT_PRECISION_THRESHOLD = 1 的连续插入次数', () => {
            // 使用精度阈值1
            testMaxInsertions(1, 16);
        });

        it('测试 DEFAULT_INITIAL_GAP = 65536, DEFAULT_PRECISION_THRESHOLD = Number.EPSILON 的连续插入次数', () => {
            // 使用Number.EPSILON作为精度阈值
            testMaxInsertions(Number.EPSILON, 68);
        });
    });
});