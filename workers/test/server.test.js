import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server.js';

let server;
let baseUrl;

before(async () => {
  server = createApp().listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('responde rápidamente y simula espera de I/O', async () => {
  const fastResponse = await fetch(`${baseUrl}/fast`);
  assert.equal(fastResponse.status, 200);
  assert.equal((await fastResponse.json()).status, 'ok');

  const ioResponse = await fetch(`${baseUrl}/slow-io?ms=0`);
  assert.equal((await ioResponse.json()).delayMs, 0);
});

test('rechaza parámetros fuera de rango', async () => {
  const response = await fetch(`${baseUrl}/heavy-cpu-worker?iterations=-1`);
  assert.equal(response.status, 400);
});

test('calcula en un worker sin cambiar el resultado', async () => {
  const response = await fetch(`${baseUrl}/heavy-cpu-worker?iterations=10`);
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.equal(result.mode, 'worker-thread');
  assert.equal(result.iterations, 10);
  assert.equal(result.checksum, Array.from({ length: 10 }, (_, index) => Math.sqrt(index))
    .reduce((total, value) => total + value, 0));
});