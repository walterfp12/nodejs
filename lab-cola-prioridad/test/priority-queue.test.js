const { test } = require('node:test');
const assert = require('node:assert/strict');
const PriorityQueue = require('../src/priority-queue');

test('procesa primero las nuevas tareas urgentes y conserva orden entre iguales', async () => {
  const processed = [];
  const queue = new PriorityQueue({ processTask: (task) => {
    processed.push(task.id);
    if (task.id === 'low-1') queue.add('vip', {}, 10);
  } });

  queue.add('low-1', {}, 1);
  queue.add('low-2', {}, 1);
  await queue.start();

  assert.deepEqual(processed, ['low-1', 'vip', 'low-2']);
  assert.equal(queue.length, 0);
});

test('un error de una tarea no detiene el procesamiento de la cola', async () => {
  const processed = [];
  const errors = [];
  const queue = new PriorityQueue({
    processTask(task) {
      processed.push(task.id);
      if (task.id === 'bad') throw new Error('fallo simulado');
    },
    onError: (error) => errors.push(error.message),
  });
  queue.add('bad', {}, 2);
  queue.add('good', {}, 1);

  await queue.start();

  assert.deepEqual(processed, ['bad', 'good']);
  assert.deepEqual(errors, ['fallo simulado']);
});