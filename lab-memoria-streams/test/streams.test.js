const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const FormateadorCSV = require('../src/etl');

test('transforma comas por pipes sin depender del tamano de los chunks', async () => {
  const input = Readable.from([Buffer.from('id,nombre\n1,Ana\n'), Buffer.from('2,Luis\n')]);
  const output = [];
  await pipeline(input, new FormateadorCSV(), async function* (source) {
    for await (const chunk of source) output.push(chunk.toString());
  });
  assert.equal(output.join(''), 'id | nombre\n1 | Ana\n2 | Luis\n');
});