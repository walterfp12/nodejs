const { spawn } = require('node:child_process');
const path = require('node:path');

const scripts = [
  ['Nodo-3001', 'node-server.js', '3001'],
  ['Nodo-3002', 'node-server.js', '3002'],
  ['Nodo-3003', 'node-server.js', '3003'],
  ['Balanceador', 'balancer.js'],
];
const children = scripts.map(([name, script, ...args]) => {
  const child = spawn(process.execPath, [path.join(__dirname, script), ...args], {
    stdio: 'inherit',
  });
  child.on('error', (error) => console.error(`${name}: ${error.message}`));
  return child;
});

function stopCluster() {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

process.on('SIGINT', stopCluster);
process.on('SIGTERM', stopCluster);