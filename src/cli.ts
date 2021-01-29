#!/usr/bin/env node
import yargs from 'yargs/yargs';
import chalk from 'chalk';
import { bigint2text } from '.';

var argv = yargs(process.argv.slice(2))
  .usage('Usage: n2t -n [num] [-sf]')
  .wrap(110)
  .options({
    // type: 'string' is because of Number precision error.
    num: { type: 'string', alias: 'n', desc: 'Number to be formatted' },
    short: {
      type: 'boolean',
      default: false,
      alias: 's',
      desc: "If passed, variant will be `'short'` instead of `'long'`",
    },
    formatTriples: {
      type: 'boolean',
      default: false,
      alias: 'f',
      desc: 'If `true`, format each 3-digit. Default is `false`',
    },
  }).argv;

if (argv.num) {
  const bignum = BigInt(argv.num);
  process.stdout.write(
    chalk.green.bold(
      bigint2text({
        num: bignum,
        variant: argv.short ? 'short' : 'long',
        formatTriples: argv.formatTriples,
      })
    ) + '\n'
  );
  process.exit(0);
}

process.stdin.resume();
process.stdin.setEncoding('utf8');

if (process.stdin.isTTY) {
  process.stdout.write(chalk.underline('Enter an integer number:') + ' \u001B[36m');
}

process.stdin.on('data', buffer => {
  process.stdout.write('\u001B[39m');
  const num = buffer.toString().trim();
  if (!isNaN(+num)) {
    const bignum = BigInt(num);
    process.stdout.write(chalk.green.bold(bigint2text({ num: bignum })) + '\n');
    process.exit(0);
  } else {
    process.stderr.write(chalk.red.bold('Enter a number please!\n'));
    process.exit(42);
  }
});
