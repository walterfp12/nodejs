const fs = require('node:fs');
const path = require('node:path');
const { pipeline } = require('node:stream');
const FormateadorCSV = require('./etl');

const inputPath = path.resolve(process.argv[2] || 'big.csv');
const outputPath = path.resolve(process.argv[3] || 'final.txt');

if (!fs.existsSync(inputPath)) {
  console.error(`No existe el archivo de entrada: ${inputPath}`);
  process.exit(1);
}

const interval = setInterval(() => {
  const heapMb = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Consumo Heap: ${heapMb.toFixed(2)} MB`);
}, 500);

pipeline(
  fs.createReadStream(inputPath),
  new FormateadorCSV(),
  fs.createWriteStream(outputPath),
  (error) => {
    clearInterval(interval);
    if (error) {
      console.error(`Error de stream: ${error.message}`);
      process.exitCode = 1;
      return;
    }
    console.log(`Procesamiento completado: ${outputPath}`);
  },
);