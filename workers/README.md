# Laboratorio: Event Loop y Worker Threads

Ejemplo local e independiente de los demas proyectos. Compara una tarea de CPU ejecutada en el hilo principal con la misma tarea movida a un `Worker`.

## Requisitos

- Node.js 20 o superior.

## Ejecucion

Desde esta carpeta:

```powershell
npm install
npm start
```

El servidor queda en `http://localhost:3000`. Puedes cambiar el puerto con la variable `PORT`.

## Rutas

- `GET /fast`: respuesta inmediata.
- `GET /slow-io?ms=4000`: simula una espera de I/O sin bloquear el Event Loop.
- `GET /heavy-cpu-block?iterations=100000000`: ejecuta el bucle en el hilo principal y bloquea temporalmente las demas peticiones.
- `GET /heavy-cpu-worker?iterations=100000000`: ejecuta el mismo bucle en un worker y deja libre el hilo principal.

El parametro `iterations` acepta valores entre 0 y 500000000. Para observar el bloqueo, inicia `/heavy-cpu-block` y solicita `/fast` desde otra terminal: la respuesta rapida tendra que esperar. Repite con `/heavy-cpu-worker`: `/fast` podra responder mientras el worker calcula.

El ejemplo muestra saturacion de CPU, no consumo significativo de memoria. Un worker evita bloquear el Event Loop principal, pero no elimina el costo de CPU ni garantiza que una maquina con pocos nucleos procese mas trabajo total.

## Pruebas

```powershell
npm test
```