/* A module for formating numbers to text.
 * @module bigint2text
 */

/**
 * Function for formatting 3-digit numbers (from 1 up to 999).
 *
 * @param {number} num- Number to be formatted
 *
 * @returns {string} Formatted number;
 *
 * @example
 * triple2text(420)
 * // will return
 * 'four hundred and twenty'
 */
const triple2text = (num: number): string => {
    const ONE = [
        '',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
    ];
    const TEN = [
        '',
        '',
        'twenty',
        'thirty',
        'fourty',
        'fifty',
        'sixty',
        'seventy',
        'eighty',
        'ninety',
    ];
    const TEEN = [
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen',
    ];
    if (num < 0 || num > 999) {
        throw new Error(
            'triple2text cannot format numbers lower than 0 or greater than 999. Please use bigint2text instead.'
        );
    }

    if (!Number.isInteger(num)) {
        throw new Error('triple2text cannot format floats.');
    }

    const [one, ten, hun] = num.toString().split('').reverse();
    const w = [];

    if (one && ten !== '1' && one !== '0') {
        w.unshift(ONE[+one]);
    }
    if (ten && ten !== '0') {
        if (ten === '1') {
            w.unshift(TEEN[+(one || 0)]);
        } else if (one !== '0') {
            w.unshift(TEN[+ten] + '-');
        } else {
            w.unshift(TEN[+ten]);
        }
    }
    if (hun && hun !== '0') {
        if (ten !== '0' || one !== '0') {
            w.unshift(ONE[+hun] + ' hundred and ');
        } else if (hun !== '0') {
            w.unshift(ONE[+hun] + ' hundred');
        }
    }
    return w.join('');
};

/**
 * Types of arguments for `bigint2text` function.
 */
type bigint2textParams = {
    /**
     * @param {bigint} num - Number to be formatted.
     */
    num: bigint;
    /**
     * @param {boolean} [formatTriples=false] - If `true`, format each 3-digit. Default is `false`.
     */
    formatTriples?: boolean;
};

const ONE_TENTHS = [
    '',
    'mi',
    'bi',
    'tri',
    'quadri',
    'quinti',
    'sexti',
    'septi',
    'octi',
    'noni',
];

const ONE = [
    '',
    'un',
    'duo',
    'tre',
    'quattuor',
    'quin',
    'sex',
    'septen',
    'octo',
    'novem',
];

const TEN = [
    '',
    'deci',
    'viginti',
    'triginti',
    'quadraginti',
    'quinquaginti',
    'sexaginti',
    'septuaginti',
    'octoginti',
    'nonaginti',
];

const HUNDRED = [
    '',
    'centi',
    'ducenti',
    'tricenti',
    'quadragenti',
    'quintigenti',
    'sexgenti',
    'septengenti',
    'octingenti',
    'nongenti',
];

const THOUSAND = [
    '',
    'm',
    'dum',
    'trim',
    'quadrim',
    'quintim',
    'sextim',
    'septim',
    'octim',
    'nonim',
];

const CARDINALS = [ONE, TEN, HUNDRED];
const CARDINALS_2 = [THOUSAND, TEN, HUNDRED];

/**
 * Function to format number.
 * @param {bigint}           num                   - Number to be formatted.
 * @param {'long' | 'short'} [variant='long']      - Variant of the formatting. Can be either `'long'` or `'short'`.
 * @param {boolean}          [formatTriples=false] - If `true`, format each 3-digit. Default is `false`.
 *
 * @return {string} Formatted number.
 * @example
 * bigint2text({ num: 13371337133713371337133713371337n, formatTriples: true })
 * // will return
 * 'thirteen nonillion three hundred and seventy-one octillion three hundred and thirty-seven septillion one hundred and thirty-three sextillion seven hundred and thirteen quintillion three hundred and seventy-one quadrillion three hundred and thirty-seven trillion one hundred and thirty-three billion seven hundred and thirteen million three hundred and seventy-one thousand three hundred and thirty-seven'
 */
export const bigint2text = ({
    num,
    formatTriples = false,
}: bigint2textParams): string => {
    return (
        (num < 0n ? (formatTriples ? 'minus ' : '-') : '') +
        (
            num
                .toString()
                .match(/\d{1,3}(?=(\d{3})*$)/g)!
                .reverse()
                .map((triple, power) => {
                    if (triple === '000') {
                        return '';
                    }
                    return `${
                        formatTriples ? triple2text(+triple) : +triple
                    } ${powerName(power - 1)}`;
                })
                .reverse()
                .join(' ') || 'zero'
        ).trim()
    );
};

export const powerName = (power: number): string => {
    const POSTFIX = 'llion';
    const SUFFIX = 'illi';

    if (power < 0) {
        return '';
    } else if (power == 0) {
        return 'thousand';
    } else if (power < 10) {
        return ONE_TENTHS[power] + POSTFIX;
    }

    const digits = power.toString().split('').reverse();
    const triples = digits
        .reduce((all: string[], one, i) => {
            const ch = Math.floor(i / 3);
            all[ch] = (all[ch] || '') + one;
            return all;
        }, [])
        .reverse();

    const formatTriple = (triple: string) =>
        triple.split('').reduce((acc, digit, idx) => {
            const decimalPlace = idx % 3;
            const lookup = idx < 3 ? CARDINALS : CARDINALS_2;
            const suffix = lookup[decimalPlace]!![+digit]!!;
            acc += suffix;
            return acc;
        }, '');

    const formatted =
        triples.reduce((acc, triple, idx) => {
            const f = formatTriple(triple);
            acc +=
                f +
                (idx < triples.length - 1
                    ? f[f.length - 1] == 'i'
                        ? 'n' + SUFFIX
                        : SUFFIX
                    : '');
            return acc;
        }, '') + POSTFIX;

    return formatted;
};
