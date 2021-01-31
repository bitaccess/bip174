import { KeyValue } from '../interfaces';
import * as varuint from './varint';

export const range = (n: number): number[] => [...Array(n).keys()];

export function reverseBuffer(buffer: Buffer): Buffer {
  if (buffer.length < 1) return buffer;
  let j = buffer.length - 1;
  let tmp = 0;
  for (let i = 0; i < buffer.length / 2; i++) {
    tmp = buffer[i];
    buffer[i] = buffer[j];
    buffer[j] = tmp;
    j--;
  }
  return buffer;
}

export function keyValsToBuffer(keyVals: KeyValue[]): Buffer {
  const buffers = keyVals.map(keyValToBuffer);
  buffers.push(Buffer.from([0]));
  return Buffer.concat(buffers);
}

export function keyValToBuffer(keyVal: KeyValue): Buffer {
  const keyLen = keyVal.key.length;
  const valLen = keyVal.value.length;
  const keyVarIntLen = varuint.encodingLength(keyLen);
  const valVarIntLen = varuint.encodingLength(valLen);

  const buffer = Buffer.allocUnsafe(
    keyVarIntLen + keyLen + valVarIntLen + valLen,
  );

  varuint.encode(keyLen, buffer, 0);
  keyVal.key.copy(buffer, keyVarIntLen);
  varuint.encode(valLen, buffer, keyVarIntLen + keyLen);
  keyVal.value.copy(buffer, keyVarIntLen + keyLen + valVarIntLen);

  return buffer;
}

// https://github.com/feross/buffer/blob/master/index.js#L1127
function verifuint(value: number | bigint, max: number | bigint): void {
  if (!(typeof value === 'number' || typeof value === 'bigint'))
    throw new Error('cannot write a non-number as a number');
  if (value < 0)
    throw new Error('specified a negative value for writing an unsigned value');
  if (value > max) throw new Error('RangeError: value out of range');
  if (typeof value === 'number' && Math.floor(value) !== value)
    throw new Error('value has a fractional component');
}

export function readUInt64LE(buffer: Buffer, offset: number): bigint {
  const value = buffer.readBigUInt64LE(offset);
  verifuint(value, 0xffffffffffffffff);
  return value;
}

export function writeUInt64LE(
  buffer: Buffer,
  value: number | bigint,
  offset: number,
): number {
  if (typeof value === 'bigint') {
    verifuint(value, BigInt('0xffffffffffffffff'));
    buffer.writeBigUInt64LE(value, offset);
  } else {
    verifuint(value, 0x001fffffffffffff);
    buffer.writeInt32LE(value & -1, offset);
    buffer.writeUInt32LE(Math.floor(value / 0x100000000), offset + 4);
  }
  return offset + 8;
}
