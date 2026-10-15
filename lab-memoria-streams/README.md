# Laboratorio 2: memoria, streams y backpressure

Generador de CSV, transformador `Transform` y tuberia nativa para procesar archivos grandes con memoria acotada. No requiere dependencias externas.

## Requisito

- Node.js 20 o superior.

## Ejecucion

Desde esta carpeta:

```powershell
npm run seed
npm run pipeline
```

Por seguridad, el generador crea 100 000 filas por defecto. Puedes elegir el tamano y la ruta del archivo:

```powershell
node src/seed.js 1000000 big.csv
node src/pipeline.js big.csv final.txt
```

El material propone 10 millones de filas (aproximadamente 1 GB, segun el formato). Ese volumen es opcional: ejecuta `node src/seed.js 10000000 big.csv` solo si tienes suficiente espacio libre. El generador espera el evento `drain` cuando `write()` indica backpressure; la tuberia conecta lectura, transformacion y escritura, propaga errores y libera la telemetria al terminar.

El transformador sustituye cada coma por ` | ` en cada fragmento recibido. Tanto la lectura como la escritura son streams, por lo que el archivo completo no se carga en el Heap.

## Pruebas

```powershell
npm test
```