/// <reference types="node" />
export declare function encode(_number: number | bigint, buffer?: Buffer, offset?: number): Buffer;
export declare function decode(buffer: Buffer, offset?: number): number | bigint;
export declare function encodingLength(_number: number | bigint): number;
