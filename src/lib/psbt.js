'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const combiner_1 = require('./combiner');
const convert = require('./converter');
const interfaces_1 = require('./interfaces');
const parser_1 = require('./parser');
const typeFields_1 = require('./typeFields');
const utils_1 = require('./utils');
const {
  globals: {
    unsignedTx: { isTransactionInput, isTransactionOutputScript },
  },
} = convert;
class Psbt {
  static fromTransaction(txBuf, txCountGetter) {
    if (txCountGetter === undefined)
      txCountGetter = convert.globals.unsignedTx.getInputOutputCounts;
    const result = txCountGetter(txBuf);
    const psbt = new this();
    psbt.globalMap.unsignedTx = txBuf;
    while (result.inputCount > 0) {
      psbt.inputs.push({
        keyVals: [],
      });
      result.inputCount--;
    }
    while (result.outputCount > 0) {
      psbt.outputs.push({
        keyVals: [],
      });
      result.outputCount--;
    }
    return psbt;
  }
  static fromBase64(data, txCountGetter) {
    const buffer = Buffer.from(data, 'base64');
    return this.fromBuffer(buffer, txCountGetter);
  }
  static fromHex(data, txCountGetter) {
    const buffer = Buffer.from(data, 'hex');
    return this.fromBuffer(buffer, txCountGetter);
  }
  static fromBuffer(buffer, txCountGetter) {
    const psbt = new this();
    const results = parser_1.psbtFromBuffer(buffer, txCountGetter);
    Object.assign(psbt, results);
    return psbt;
  }
  constructor() {
    this.globalMap = {
      keyVals: [],
      // version 1, locktime 0, 0 ins, 0 outs
      unsignedTx: Buffer.from('01000000000000000000', 'hex'),
    };
    this.inputs = [];
    this.outputs = [];
  }
  toBase64() {
    const buffer = this.toBuffer();
    return buffer.toString('base64');
  }
  toHex() {
    const buffer = this.toBuffer();
    return buffer.toString('hex');
  }
  toBuffer() {
    return parser_1.psbtToBuffer(this);
  }
  addNonWitnessUtxoToInput(inputIndex, nonWitnessUtxo) {
    const input = utils_1.checkForInput(this.inputs, inputIndex);
    if (input.nonWitnessUtxo || input.witnessUtxo) {
      throw new Error(`Input #${inputIndex} already has a Utxo attribute`);
    }
    if (!Buffer.isBuffer(nonWitnessUtxo)) {
      throw new Error('nonWitnessUtxo should be a Buffer of a Transaction');
    }
    input.nonWitnessUtxo = nonWitnessUtxo;
    return this;
  }
  addWitnessUtxoToInput(inputIndex, witnessUtxo) {
    const input = utils_1.checkForInput(this.inputs, inputIndex);
    if (input.nonWitnessUtxo || input.witnessUtxo) {
      throw new Error(`Input #${inputIndex} already has a Utxo attribute`);
    }
    if (!interfaces_1.isWitnessUtxo(witnessUtxo)) {
      throw new Error(
        'witnessUtxo should be { script: Buffer; value: number; }',
      );
    }
    input.witnessUtxo = witnessUtxo;
    return this;
  }
  addPartialSigToInput(inputIndex, partialSig) {
    const input = utils_1.checkForInput(this.inputs, inputIndex);
    if (!interfaces_1.isPartialSig(partialSig)) {
      throw new Error(
        'partialSig should be { pubkey: Buffer; signature: Buffer; }',
      );
    }
    if (input.partialSig === undefined) input.partialSig = [];
    input.partialSig.push(partialSig);
    return this;
  }
  addSighashTypeToInput(inputIndex, sighashType) {
    const input = utils_1.checkForInput(this.inputs, inputIndex);
    if (typeof sighashType !== 'number') {
      throw new Error('sighashType should be a number');
    }
    input.sighashType = sighashType;
    return this;
  }
  addRedeemScriptToInput(inputIndex, redeemScript) {
    const input = utils_1.checkForInput(this.inputs, inputIndex);
    if (!Buffer.isBuffer(redeemScript)) {
      throw new Error('redeemScript should be a Buffer');
    }
    input.redeemScript = redeemScript;
    return this;
  }
  addWitnessScriptToInput(inputIndex, witnessScript) {
    const input = utils_1.checkForInput(this.inputs, inputIndex);
    if (!Buffer.isBuffer(witnessScript)) {
      throw new Error('witnessScript should be a Buffer');
    }
    input.witnessScript = witnessScript;
    return this;
  }
  addBip32DerivationToInput(inputIndex, bip32Derivation) {
    const input = utils_1.checkForInput(this.inputs, inputIndex);
    if (!interfaces_1.isBip32Derivation(bip32Derivation)) {
      throw new Error(
        'bip32Derivation should be { masterFingerprint: Buffer; pubkey: ' +
          'Buffer; path: string; }',
      );
    }
    if (input.bip32Derivation === undefined) input.bip32Derivation = [];
    input.bip32Derivation.push(bip32Derivation);
    return this;
  }
  addFinalScriptSigToInput(inputIndex, finalScriptSig) {
    const input = utils_1.checkForInput(this.inputs, inputIndex);
    if (!Buffer.isBuffer(finalScriptSig)) {
      throw new Error('finalScriptSig should be a Buffer');
    }
    input.finalScriptSig = finalScriptSig;
    return this;
  }
  addFinalScriptWitnessToInput(inputIndex, finalScriptWitness) {
    const input = utils_1.checkForInput(this.inputs, inputIndex);
    if (!Buffer.isBuffer(finalScriptWitness)) {
      throw new Error('finalScriptWitness should be a Buffer');
    }
    input.finalScriptWitness = finalScriptWitness;
    return this;
  }
  addPorCommitmentToInput(inputIndex, porCommitment) {
    const input = utils_1.checkForInput(this.inputs, inputIndex);
    if (typeof porCommitment !== 'string') {
      throw new Error('porCommitment should be a string');
    }
    input.porCommitment = porCommitment;
    return this;
  }
  addRedeemScriptToOutput(outputIndex, redeemScript) {
    const output = utils_1.checkForOutput(this.outputs, outputIndex);
    if (!Buffer.isBuffer(redeemScript)) {
      throw new Error('redeemScript should be a Buffer');
    }
    output.redeemScript = redeemScript;
    return this;
  }
  addWitnessScriptToOutput(outputIndex, witnessScript) {
    const output = utils_1.checkForOutput(this.outputs, outputIndex);
    if (!Buffer.isBuffer(witnessScript)) {
      throw new Error('witnessScript should be a Buffer');
    }
    output.witnessScript = witnessScript;
    return this;
  }
  addBip32DerivationToOutput(outputIndex, bip32Derivation) {
    const output = utils_1.checkForOutput(this.outputs, outputIndex);
    if (!interfaces_1.isBip32Derivation(bip32Derivation)) {
      throw new Error(
        'bip32Derivation should be { masterFingerprint: Buffer; pubkey: ' +
          'Buffer; path: string; }',
      );
    }
    if (output.bip32Derivation === undefined) output.bip32Derivation = [];
    output.bip32Derivation.push(bip32Derivation);
    return this;
  }
  addKeyValToGlobal(keyVal) {
    utils_1.checkHasKey(
      keyVal,
      this.globalMap.keyVals,
      utils_1.getEnumLength(typeFields_1.GlobalTypes),
    );
    this.globalMap.keyVals.push(keyVal);
    return this;
  }
  addKeyValToInput(inputIndex, keyVal) {
    const input = utils_1.checkForInput(this.inputs, inputIndex);
    utils_1.checkHasKey(
      keyVal,
      input.keyVals,
      utils_1.getEnumLength(typeFields_1.InputTypes),
    );
    input.keyVals.push(keyVal);
    return this;
  }
  addKeyValToOutput(outputIndex, keyVal) {
    const output = utils_1.checkForOutput(this.outputs, outputIndex);
    utils_1.checkHasKey(
      keyVal,
      output.keyVals,
      utils_1.getEnumLength(typeFields_1.OutputTypes),
    );
    output.keyVals.push(keyVal);
    return this;
  }
  addInput(inputData, transactionInputAdder) {
    const txBuf = this.getTransaction();
    let newTxBuf;
    if (isTransactionInput(inputData)) {
      newTxBuf = convert.globals.unsignedTx.addInput(inputData, txBuf);
    } else {
      if (transactionInputAdder === undefined) {
        throw new Error(
          'If inputData is not a TransactionInput object, you must pass a ' +
            'function to handle it.',
        );
      }
      newTxBuf = transactionInputAdder(inputData, txBuf);
    }
    utils_1.insertTxInGlobalMap(newTxBuf, this.globalMap);
    this.inputs.push({
      keyVals: [],
    });
    const addKeyVals = inputData.keyVals || [];
    const inputIndex = this.inputs.length - 1;
    if (!Array.isArray(addKeyVals)) {
      throw new Error('keyVals must be an Array');
    }
    addKeyVals.forEach(keyVal => this.addKeyValToInput(inputIndex, keyVal));
    utils_1.addInputAttributes(this, inputData);
    return this;
  }
  addOutput(outputData, allowNoInput = false, transactionOutputAdder) {
    if (!allowNoInput && this.inputs.length === 0) {
      throw new Error(
        'Add Output: can not add an output before adding an input.',
      );
    }
    const txBuf = this.getTransaction();
    let newTxBuf;
    if (isTransactionOutputScript(outputData)) {
      newTxBuf = convert.globals.unsignedTx.addOutput(outputData, txBuf);
    } else {
      if (transactionOutputAdder === undefined) {
        if (typeof outputData.address === 'string') {
          throw new Error(
            'Must use a transactionOutputAdder to parse address.',
          );
        }
        throw new Error(
          'If outputData is not a TransactionOutput object, you must pass a ' +
            'function to handle it.',
        );
      }
      newTxBuf = transactionOutputAdder(outputData, txBuf);
    }
    utils_1.insertTxInGlobalMap(newTxBuf, this.globalMap);
    this.outputs.push({
      keyVals: [],
    });
    const addKeyVals = outputData.keyVals || [];
    const outputIndex = this.outputs.length - 1;
    if (!Array.isArray(addKeyVals)) {
      throw new Error('keyVals must be an Array');
    }
    addKeyVals.forEach(keyVal => this.addKeyValToInput(outputIndex, keyVal));
    utils_1.addOutputAttributes(this, outputData);
    return this;
  }
  clearFinalizedInput(inputIndex) {
    const input = utils_1.checkForInput(this.inputs, inputIndex);
    utils_1.inputCheckUncleanFinalized(inputIndex, input);
    for (const key of Object.keys(input)) {
      if (
        ![
          'witnessUtxo',
          'nonWitnessUtxo',
          'finalScriptSig',
          'finalScriptWitness',
          'keyVals',
        ].includes(key)
      ) {
        // @ts-ignore
        delete input[key];
      }
    }
    return this;
  }
  combine(...those) {
    // Combine this with those.
    // Return self for chaining.
    const result = combiner_1.combine([this].concat(those));
    Object.assign(this, result);
    return this;
  }
  getTransaction() {
    return utils_1.getTransactionFromGlobalMap(this.globalMap);
  }
}
exports.Psbt = Psbt;
