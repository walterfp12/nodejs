# Laboratorio 1: escalamiento de nodos

Proxy TCP de capa 4, tres procesos Node.js aislados y distribucion Round-Robin. Usa solo modulos nativos; no necesita instalar dependencias.

## Requisito

- Node.js 20 o superior.

## Ejecucion

Desde esta carpeta, inicia todo el cluster en una terminal:

```powershell
npm start
```

O abre cuatro terminales y ejecuta `npm run node:1`, `npm run node:2`, `npm run node:3` y `npm run balancer`. El proxy escucha en `127.0.0.1:8080`; los nodos usan los puertos 3001, 3002 y 3003.

Prueba desde PowerShell con Node.js:

```powershell
node -e "const n=require('net'); for(let i=0;i<6;i++){const c=n.connect(8080,'127.0.0.1',()=>c.write('Ping\n')); c.pipe(process.stdout)}"
```

El proxy distribuye conexiones TCP, no peticiones HTTP: cada conexion nueva avanza al siguiente nodo. El tunel bidireccional se cierra al finalizar el socket. Si un nodo elegido no esta disponible, el cliente recibe un error y el balanceador permanece activo.

## Pruebas

```powershell
npm test
```

Las pruebas levantan procesos locales temporales en puertos alternativos y verifican el orden Round-Robin.