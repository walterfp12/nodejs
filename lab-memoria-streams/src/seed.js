const fs = require('node:fs');
const path = require('node:path');
const { once } = require('node:events');

const rows = Number(process.argv[2] || 100000);
const outputPath = path.resolve(process.argv[3] || 'big.csv');

if (!Number.isSafeInteger(rows) || rows < 0) {
  console.error('Indica un numero entero no negativo de filas.');
  process.exit(1);
}

async function seed() {
  const output = fs.createWriteStream(outputPath);
  try {
    for (let index = 0; index < rows; index += 1) {
      const row = `${index},${(index * 7919) % 5000},ACTIVO\n`;
      if (!output.write(row)) await once(output, 'drain');
    }
    output.end();
    await once(output, 'finish');
    console.log(`Generadas ${rows} filas en ${outputPath}`);
  } catch (error) {
    output.destroy();
    console.error(`No se pudo generar el CSV: ${error.message}`);
    process.exitCode = 1;
  }
}

seed();