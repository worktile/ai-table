import _ from 'lodash';

export function numberFormat(num: number, precision: number = 2) {
    if (!_.isFinite(num)) return null;
    const absNum = Math.abs(num);
    if (absNum < 1e8) {
        const str = num.toString();
        const [intPart, decPart] = str.split('.');
        return decPart ? intPart + '.' + decPart.slice(0, precision).replace(/0+$/, '') : intPart;
    }

    const [base, exp] = num.toExponential().split('e');
    const [integer, decimal] = base.split('.');
    return `${integer}${decimal ? '.' + decimal : ''}e${exp}`;
}
