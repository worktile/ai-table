import _ from 'lodash';

export function numberFormat(num: number, precision: number = 2) {
    if (!_.isFinite(num)) return null;
    const absNum = Math.abs(num);
    if (absNum < 1e8) {
        const str = _.toString(num);
        const [intPart, decPart] = _.split(str, '.');
        return decPart ? intPart + '.' + decPart.slice(0, precision).replace(/0+$/, '') : intPart;
    }

    const [base, exp] = _.split(num.toExponential(), 'e');
    const [integer, decimal] = _.split(base, '.');
    return `${integer}${decimal ? '.' + decimal : ''}e${exp}`;
}
