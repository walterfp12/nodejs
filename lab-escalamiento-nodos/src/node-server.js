const net = require('node:net');

const port = Number(process.argv[2] || 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('El puerto debe ser un entero entre 1 y 65535.');
  process.exit(1);
}

const nodeId = `Nodo-${port}`;
const server = net.createServer((socket) => {
  console.log(`[+] Conexion recibida en ${nodeId}`);
  socket.setEncoding('utf8');

  let request = '';
  socket.on('data', (chunk) => {
    request += chunk;
    if (!request.includes('\n')) return;

    socket.end(`Respuesta desde ${nodeId}\n`);
  });

  socket.on('error', (error) => {
    console.error(`[${nodeId}] Error de socket: ${error.message}`);
  });
});

server.on('error', (error) => {
  console.error(`[${nodeId}] No se pudo iniciar: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, '127.0.0.1', () => {
  console.log(`${nodeId} escuchando en 127.0.0.1:${port}`);
});