import * as jsonbigint from 'json-bigint';
const BJSON = require('buffer-json');

const JSONBig = jsonbigint({ useNativeBigInt: true, alwaysParseAsBig: true });

export function stringify(parsed: any): string {
  return JSONBig.stringify(parsed, BJSON.replacer, 2);
}

export function parse(
  value: string,
  reviver?: (k: string, v: any) => any,
): any {
  return JSONBig.parse(value, (k: string, v: any) => {
    v = reviver ? reviver(k, v) : v;
    return BJSON.reviver(k, v);
  });
}
