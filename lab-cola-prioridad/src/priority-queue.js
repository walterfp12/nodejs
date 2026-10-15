class PriorityQueue {
  constructor({ processTask = (task) => console.log(`Procesado: ${task.id}`), onError = console.error } = {}) {
    this.tasks = [];
    this.isProcessing = false;
    this.processTask = processTask;
    this.onError = onError;
    this.completion = null;
    this.sequence = 0;
  }

  add(id, data, priority = 1) {
    if (!Number.isFinite(priority)) throw new TypeError('La prioridad debe ser numerica.');
    const task = { id, data, priority, sequence: this.sequence++ };
    this.tasks.push(task);
    this.tasks.sort((left, right) => right.priority - left.priority || left.sequence - right.sequence);
    return task;
  }

  get length() {
    return this.tasks.length;
  }

  next() {
    return this.tasks.shift();
  }

  start() {
    if (this.isProcessing) return this.completion;
    this.isProcessing = true;
    this.completion = new Promise((resolve) => { this.resolveCompletion = resolve; });
    this._processLoop();
    return this.completion;
  }

  _processLoop() {
    if (this.length === 0) {
      this.isProcessing = false;
      this.resolveCompletion();
      return;
    }

    const task = this.next();
    try {
      this.processTask(task);
    } catch (error) {
      this.onError(error, task);
    }

    setImmediate(() => this._processLoop());
  }
}

module.exports = PriorityQueue;