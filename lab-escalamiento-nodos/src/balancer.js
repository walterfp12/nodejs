const net = require('node:net');

const nodes = (process.env.NODES || '3001,3002,3003')
  .split(',')
  .map((value) => Number(value.trim()))
  .filter((port) => Number.isInteger(port) && port >= 1 && port <= 65535);
const listenPort = Number(process.env.BALANCER_PORT || 8080);

if (nodes.length === 0) {
  throw new Error('Configura al menos un puerto valido en NODES.');
}

let index = 0;
const balancer = net.createServer((client) => {
  const targetPort = nodes[index % nodes.length];
  index += 1;
  console.log(`Enrutando trafico -> Puerto ${targetPort}`);

  const node = net.createConnection({ host: '127.0.0.1', port: targetPort });
  let connected = false;

  node.once('connect', () => {
    connected = true;
    client.pipe(node);
    node.pipe(client);
  });

  node.on('error', (error) => {
    console.error(`Nodo ${targetPort} no disponible: ${error.message}`);
    if (!connected && !client.destroyed) {
      client.end('Error interno del servidor\n');
    } else {
      client.destroy();
    }
  });

  client.on('error', (error) => {
    console.error(`Error de cliente: ${error.message}`);
    node.destroy();
  });
});

balancer.on('error', (error) => {
  console.error(`No se pudo iniciar el balanceador: ${error.message}`);
  process.exitCode = 1;
});

balancer.listen(listenPort, '127.0.0.1', () => {
  console.log(`Proxy TCP Round-Robin escuchando en 127.0.0.1:${listenPort}`);
  console.log(`Nodos configurados: ${nodes.join(', ')}`);
});