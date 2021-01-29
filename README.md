# bigint2text

## Description

Format any number up to novemnonagnonacentnonimillnonidecimillillion (10^300000)!

Example:

```typescript
bigint2text({
  num: 123456789012345678901234567890123456789012345678901234567890n,
  variant: 'long',
  formatTriples: true,
});
```

produces:

```typescript
'one hundred and twenty-three octodecillion four hundred and fifty-six septendecillion seven hundred and eighty-nine sexdecillion twelve quindecillion three hundred and fourty-five quattuordecillion six hundred and seventy tredecillion three hundred and fifty-six duodecillion three hundred and nineteen undecillion six hundred and six decillion four hundred and eighty-three nonillion nine hundred and eleven octillion two hundred and twenty-nine septillion six hundred and seventy-six sextillion one hundred and twenty-two quintillion four hundred and twenty-six quadrillion two hundred and two trillion five hundred and ninety-seven billion thirty-eight million seven hundred and fifty-one thousand seven hundred and fourty-four'
```

## Installation

```bash
npm i bigint2text
```

or

```bash
yarn add bigint2text
```

## CLI

To install:

```bash
npm i -g bigint2text
```

```bash
$ n2t --help
Usage: cli -n [num] [-sf]

Options:
      --help           Show help                                                                     [boolean]
      --version        Show version number                                                           [boolean]
  -n, --num            Number to be formatted                                                         [number]
  -s, --short          If passed, variant will be `'short'` instead of `'long'`     [boolean] [default: false]
  -f, --formatTriples  If `true`, format each 3-digit. Default is `false`           [boolean] [default: false]
```

With stdin:

```bash
$ n2t
Enter an integer number: 123456789
123 million 456 thousand 789
```

With pipe:

```bash
$ echo 123456789 | n2t
123 million 456 thousand 789
```

With args:

```bash
$ n2t -n 123456789
123 million 456 thousand 789
$ n2t -n 123456789 -s
123 m 456 k 789
$ n2t -n 123456789 -f
one hundred and twenty-three million four hundred and fifty-six thousand seven hundred and eighty-nine
```
