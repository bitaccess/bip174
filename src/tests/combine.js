'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tape = require('tape');
const psbt_1 = require('../lib/psbt');
const combine_1 = require('./fixtures/combine');
const json_1 = require('./utils/json');
const txTools_1 = require('./utils/txTools');
for (const f of combine_1.fixtures) {
  tape('Test: ' + f.description, t => {
    const psbts = f.psbts.map(p =>
      psbt_1.Psbt.fromHex(p, txTools_1.transactionFromBuffer),
    );
    const jsonA1 = json_1.stringify(psbts[0]);
    const jsonA2 = json_1.stringify(psbts[1]);
    psbts[0].combine(psbts[1]);
    const jsonB1 = json_1.stringify(psbts[0]);
    const jsonB2 = json_1.stringify(psbts[1]);
    // console.log(jsonA1);
    // console.log(jsonA2);
    // console.log(jsonB1);
    // console.log(jsonB2);
    t.notDeepEqual(JSON.parse(jsonA1), JSON.parse(jsonB1));
    t.deepEqual(JSON.parse(jsonA2), JSON.parse(jsonB2));
    t.equal(psbts[0].toHex(), f.result);
    t.end();
  });
}
