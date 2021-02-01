import * as tape from 'tape';

import { Psbt } from '../lib/psbt';
import { fixtures } from './fixtures/first';
import { parse, stringify } from './utils/json';
import { transactionFromBuffer } from './utils/txTools';

for (const f of fixtures) {
  tape('Test: ' + f.description, t => {
    const parsed = Psbt.fromHex(f.input, transactionFromBuffer);
    const hex = parsed.toHex();
    const parsed2 = Psbt.fromHex(hex, transactionFromBuffer);
    const hex2 = parsed2.toHex();
    const parsed3 = Psbt.fromHex(hex2, transactionFromBuffer);
    t.strictEqual(parsed.toHex(), parsed2.toHex());
    t.strictEqual(parsed.toHex(), parsed3.toHex());
    // @ts-ignore
    parsed3.globalMap.unsignedTx = parsed3.globalMap.unsignedTx.toBuffer();
    t.deepEqual(parse(stringify(parsed3)), f.output);
    t.equal(hex, hex2);
    t.end();
  });
}
