'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const jsonbigint = require('json-bigint');
const BJSON = require('buffer-json');
const JSONBig = jsonbigint({ useNativeBigInt: true, alwaysParseAsBig: true });
function stringify(parsed) {
  return JSONBig.stringify(parsed, BJSON.replacer, 2);
}
exports.stringify = stringify;
function parse(value, reviver) {
  return JSONBig.parse(value, (k, v) => {
    v = reviver ? reviver(k, v) : v;
    return BJSON.reviver(k, v);
  });
}
exports.parse = parse;
