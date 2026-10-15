const PriorityQueue = require('./priority-queue');
const { performance } = require('node:perf_hooks');

const stressMode = process.argv.includes('--stress');
const taskCount = stressMode ? 5000 : 50;
const taskWorkMs = stressMode ? 1 : 0.5;
const queue = new PriorityQueue({
  processTask(task) {
    const startedAt = performance.now();
    while (performance.now() - startedAt < taskWorkMs) {}
    if (task.priority > 5) console.log(`[URGENTE] Procesado: ${task.id}`);
    else if (task.sequence % 1000 === 0) console.log(`Procesadas tareas de baja prioridad: ${task.sequence + 1}`);
  },
});

console.log(`Encolando ${taskCount} reportes de baja prioridad...`);
for (let index = 0; index < taskCount; index += 1) {
  queue.add(`Rep-${index}`, { mock: true }, 1);
}

const urgentDelay = stressMode ? 2000 : 25;
setTimeout(() => {
  console.log('\n--- LLEGA TRAFICO VIP ---');
  queue.add('Transf-A', { user: 'CEO' }, 10);
  queue.add('Transf-B', { user: 'CFO' }, 10);
  queue.add('Transf-C', { user: 'CTO' }, 10);
}, urgentDelay);

const processing = queue.start();
processing.then(() => console.log('Cola vaciada.'));