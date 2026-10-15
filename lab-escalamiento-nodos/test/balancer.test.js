const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const net = require('node:net');
const { spawn } = require('node:child_process');
const path = require('node:path');

const ports = [3301, 3302, 3303];
const nodes = [];
let balancer;

function request(port) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({ host: '127.0.0.1', port });
    let response = '';
    client.setEncoding('utf8');
    client.on('connect', () => client.write('Ping\n'));
    client.on('data', (chunk) => { response += chunk; });
    client.on('end', () => resolve(response));
    client.on('error', reject);
  });
}

before(async () => {
  for (const port of ports) {
    const node = spawn(process.execPath, [
      path.join(__dirname, '..', 'src', 'node-server.js'), String(port),
    ], { stdio: 'ignore' });
    nodes.push(node);
  }
  balancer = spawn(process.execPath, [path.join(__dirname, '..', 'src', 'balancer.js')], {
    env: { ...process.env, NODES: ports.join(','), BALANCER_PORT: '8380' },
    stdio: 'ignore',
  });

  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      if ((await request(8380)).startsWith('Respuesta desde Nodo-')) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error('Los nodos o el balanceador no iniciaron a tiempo.');
});

after(() => {
  for (const processHandle of [...nodes, balancer]) processHandle?.kill();
});

test('distribuye conexiones TCP en orden Round-Robin', async () => {
  const responses = await Promise.all([request(8380), request(8380), request(8380)]);
  assert.deepEqual(
    responses.map((response) => response.trim()),
    ['Respuesta desde Nodo-3302', 'Respuesta desde Nodo-3303', 'Respuesta desde Nodo-3301'],
  );
});