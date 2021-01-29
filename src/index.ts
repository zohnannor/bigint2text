/** A module for formating numbers to text.
 * @module bigint2text
 */

const long = ['', 'thousand'];
const short = ['', 'k'];

'm b tr quadr quint sext sept oct non dec'.split(' ').forEach(s => {
  long.push(`${s}illion`);
  short.push(s);
});

// 1 2 3
'un duo tre quattuor quin sex septen octo novem'.split(' ').forEach(s => {
  long.push(`${s}decillion`);
  short.push(`${s}dec`);
});

// 20 30 40
'vig trig quadrag quinquag sexag septuag octog nonag'.split(' ').forEach(s => {
  // 21 22 23
  ' un duo tre quattuor quin sex septen octo novem'.split(' ').forEach(ss => {
    long.push(`${ss}${s}intillion`);
    short.push(`${ss}${s}int`);
  });
});

// 100 200 300
'cent ducent tricent quadracent quinquacent sexacent septuacent octacent nonacent'.split(' ').forEach(s => {
  // 110 120 130
  ' de vig trig quadrag quinquag sexag septuag octog nonag'.split(' ').forEach(ss => {
    // 101 102 103
    ' un duo tre quattuor quin sex septen octo novem'.split(' ').forEach(sss => {
      long.push(`${sss}${ss}${s}illion`);
      short.push(`${sss}${ss}${s}`);
    });
  });
});

// 1000 2000 3000
'mill dumill trimill quadrimill quintimill sextimill septimill octimill nonimill'.split(' ').forEach(s => {
  // 1100 1200 1300
  ' cent ducent tricent quadracent quinquacent sexacent septuacent octacent nonacent'.split(' ').forEach(ss => {
    // 1010 1020 1030
    ' de vig trig quadrag quinquag sexag septuag octog nonag'.split(' ').forEach(sss => {
      // 1001 1002 1003
      ' un duo tre quattuor quin sex septen octo novem'.split(' ').forEach(ssss => {
        long.push(`${ssss}${sss}${ss}${s}illion`);
        short.push(`${ssss}${sss}${ss}${s}`);
      });
    });
  });
});

// 10000 20000 30000
'dec dudec tridecim quadridecim quintidecim sextidecim septidecim octidecim nonidecim'.split(' ').forEach(s => {
  // 11000 12000 13000
  ' mill dumill trimill quadrimill quintimill sextimill septimill octimill nonimill'.split(' ').forEach(ss => {
    // 10100 10200 10300
    ' cent ducent tricent quadracent quinquacent sexacent septuacent octacent nonacent'.split(' ').forEach(sss => {
      // 10010 10020 10030
      ' de vig trig quadrag quinquag sexag septuag octog nonag'.split(' ').forEach(ssss => {
        // 10001 10002 10003
        ' un duo tre quattuor quin sex septen octo novem'.split(' ').forEach(sssss => {
          long.push(`${sssss}${ssss}${sss}${ss}${s}illillion`);
          short.push(`${sssss}${ssss}${sss}${ss}${s}ill`);
        });
      });
    });
  });
});

const ones = ' one two three four five six seven eight nine'.split(' ');
const tens = '  twenty thirty fourty fifty sixty seventy eighty ninety'.split(' ');
const teen = 'ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' ');

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
  if (num < 0 || num > 999) {
    throw new Error(
      'triple2text cannot format numbers lower than 0 or greater than 999. Please use bigint2text instead.'
    );
  }

  if (!Number.isInteger(num)) {
    throw new Error('triple2text cannot format floats.');
  }

  const [one, ten, hun] = [...num.toString()].reverse();
  const w = [];

  if (one && ten !== '1' && one !== '0') {
    w.unshift(ones[+one]);
  }
  if (ten && ten !== '0') {
    if (ten === '1') {
      w.unshift(teen[+(one || 0)]);
    } else if (one !== '0') {
      w.unshift(tens[+ten] + '-');
    } else {
      w.unshift(tens[+ten]);
    }
  }
  if (hun && hun !== '0') {
    if (ten !== '0' || one !== '0') {
      w.unshift(ones[+hun] + ' hundred and ');
    } else if (hun !== '0') {
      w.unshift(ones[+hun] + ' hundred');
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
   * @param {'long' | 'short'} [variant='long'] - Variant of the formatting. Can be either `'long'` or `'short'`.
   */
  variant?: 'long' | 'short';
  /**
   * @param {boolean} [formatTriples=false] - If `true`, format each 3-digit. Default is `false`.
   */
  formatTriples?: boolean;
};

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
export const bigint2text = ({ num, variant = 'long', formatTriples = false }: bigint2textParams): string => {
  return (
    (num < 0n ? (formatTriples ? 'minus ' : '-') : '') +
    (
      num
        .toString()
        .match(/\d{1,3}(?=(\d{3})*$)/g)!
        .reverse()
        .map(triple => (formatTriples ? triple2text(+triple) : triple))
        .map((triple, power) =>
          triple && triple !== '000' ? `${triple} ${(variant === 'long' ? long : short)[power]}` : ''
        )
        .reverse()
        .join(' ') || 'zero'
    ).trim()
  );
};

bigint2text({
  num: 123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890n,
  variant: 'long',
  formatTriples: true,
});
