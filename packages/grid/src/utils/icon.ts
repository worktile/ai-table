import * as fileIcons from '../constants/file-icon';

export function parseSVGToCanvasObjects(svgString: string) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const elements = svgDoc.querySelectorAll('path, polyline, polygon');
    const canvasObjects: {
        d: string | null;
        fill: string;
        stroke: string;
        strokeWidth: string | number;
        opacity: number;
        fillRule?: CanvasFillRule;
    }[] = [];

    elements.forEach((element) => {
        let d;
        if (element.tagName === 'path') {
            d = element.getAttribute('d');
        } else if (element.tagName === 'polyline' || element.tagName === 'polygon') {
            const points = element.getAttribute('points') || '';
            const pointArray = points.split(/\s+|,/).filter(Boolean);
            d = 'M' + pointArray[0] + ' ' + pointArray[1];
            for (let i = 2; i < pointArray.length; i += 2) {
                d += ' L' + pointArray[i] + ' ' + pointArray[i + 1];
            }
            if (element.tagName === 'polygon') {
                d += ' Z';
            }
        }

        const fill = element.getAttribute('fill') || 'black';
        // const stroke = 'none';
        // const fill = element.getAttribute('fill') || (null as any);
        const stroke = element.getAttribute('stroke') || 'none';
        const strokeWidth = element.getAttribute('stroke-width') || 0;
        const opacity = parseFloat(element?.getAttribute('opacity') || '1');
        // const fillRule = element.getAttribute('fill-rule') || 'nonzero';
        if (d) {
            canvasObjects.push({
                d,
                fill,
                stroke,
                strokeWidth,
                opacity
                // fillRule: fillRule as CanvasFillRule
            });
        }
    });

    return canvasObjects;
}
export const FileIcons = (() => {
    const result: {
        [T in string]: {
            d: string | null;
            fill: string;
            stroke: string;
            strokeWidth: string | number;
            opacity: number;
            fillRule?: CanvasFillRule;
        }[];
    } = {};
    Object.entries(fileIcons).forEach((fileIcon) => {
        result[fileIcon[0]] = parseSVGToCanvasObjects(fileIcon[1]);
    });
    return result;
})();

export const FileIconSvgStrings = (() => {
    const result: {
        [T in string]: string;
    } = {};
    Object.entries(fileIcons).forEach((fileIcon) => {
        result[fileIcon[0]] = fileIcon[1];
    });
    return result;
})();
