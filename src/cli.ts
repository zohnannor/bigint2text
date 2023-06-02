#!/usr/bin/env node
import yargs from 'yargs/yargs';
import chalk from 'chalk';
import { bigint2text } from '.';

/**
 * @param {string}   num in exponent format. Other formats are returned as is.
 * @return {string}  Returns a decimal number string.
 */
const numberExponentToLarge = (num: string): string => {
    let sign = '';
    if (num.charAt(0) == '-') {
        num = num.substring(1);
        sign = '-';
    }

    let str = num.split(/[eE]/g);
    if (str.length < 2) {
        return sign + num;
    }
    const power = +str[1]!!;

    str = str[0]!!.split('.');
    let baseRH = str[1] || '';
    let baseLH = str[0]!!;

    if (power >= 0) {
        if (power > baseRH.length) {
            baseRH += '0'.repeat(power - baseRH.length);
        }
        baseRH = baseRH.slice(0, power) + '.' + baseRH.slice(power);
        if (baseRH.charAt(baseRH.length - 1) == '.') {
            baseRH = baseRH.slice(0, -1);
        }
    } else {
        const num = Math.abs(power) - baseLH.length;
        if (num > 0) {
            baseLH = '0'.repeat(num) + baseLH;
        }
        baseLH = baseLH.slice(0, power) + '.' + baseLH.slice(power);
        if (baseLH.charAt(0) == '.') {
            baseLH = '0' + baseLH;
        }
    }
    return sign + (baseLH + baseRH).replace(/^0*(\d+|\d+\.\d+?)\.?0*$/, '$1');
};

const argv = yargs(process.argv.slice(2))
    .usage('Usage: n2t -n [num] [-f]')
    .wrap(110)
    .options({
        // type: 'string' is because of Number precision error.
        num: {
            type: 'string',
            alias: 'n',
            desc: 'Number to be formatted',
        },
        formatTriples: {
            type: 'boolean',
            default: false,
            alias: 'f',
            desc: 'If `true`, format each 3-digit. Default is `false`',
        },
    })
    .parseSync();

if (argv.num) {
    const bignum = BigInt(numberExponentToLarge(argv.num));
    process.stdout.write(
        chalk.green.bold(
            bigint2text({
                num: bignum,
                formatTriples: argv.formatTriples,
            })
        ) + '\n'
    );
    process.exit(0);
}

process.stdin.resume();
process.stdin.setEncoding('utf8');

if (process.stdin.isTTY) {
    process.stdout.write(
        chalk.underline('Enter an integer number:') + ' \u001B[36m'
    );
}

process.stdin.on('data', buffer => {
    process.stdout.write('\u001B[39m');
    const num = +buffer.toString().trim();
    if (!isNaN(num)) {
        const bignum = BigInt(numberExponentToLarge(buffer.toString()));
        process.stdout.write(
            chalk.green.bold(bigint2text({ num: bignum })) + '\n'
        );
        process.exit(0);
    } else {
        process.stderr.write(chalk.red.bold('Enter a number please!\n'));
        process.exit(42);
    }
});
