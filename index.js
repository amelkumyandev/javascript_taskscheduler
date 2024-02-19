class TaskScheduler {
  constructor() {
    this.taskQueue = [];
    this.currentTaskTimer = null;
    this.paused = false;
    this.currentTaskRemainingTime = null;
    this.currentTaskStartTime = null;
  }

  addTask(taskFunction, delay) {
    this.taskQueue.push({ taskFunction, delay });
  }

  start() {
    if (!this.paused && this.taskQueue.length > 0) {
      this.executeNextTask();
    }
  }

  executeNextTask() {
    if (this.taskQueue.length === 0) {
      console.log("All tasks have been executed.");
      return;
    }

    if (this.paused) {
      return;
    }

    const { taskFunction, delay } = this.taskQueue.shift();

    this.currentTaskRemainingTime = delay;
    this.currentTaskStartTime = Date.now();

    this.currentTaskTimer = setTimeout(() => {
      try {
        taskFunction();
      } catch (error) {
        console.error('Task execution error:', error);
      }
      this.executeNextTask();
    }, this.currentTaskRemainingTime);
  }

  pause() {
    if (!this.paused && this.currentTaskTimer) {
      clearTimeout(this.currentTaskTimer);
      this.paused = true;
      const elapsedTime = Date.now() - this.currentTaskStartTime;
      this.currentTaskRemainingTime -= elapsedTime;
    }
  }

  resume() {
    if (this.paused) {
      this.paused = false;
      // Immediately start the next task with the adjusted remaining time
      this.executeNextTask();
    }
  }

  cancel() {
    clearTimeout(this.currentTaskTimer);
    this.taskQueue = [];
    this.paused = false;
    console.log("Scheduler canceled. All pending tasks have been removed.");
  }
}

// Example Usage
const scheduler = new TaskScheduler();

scheduler.addTask(() => console.log("Task 1 executed"), 2000); // Execute after 2 seconds
scheduler.addTask(() => console.log("Task 2 executed"), 3000); // Then execute after 3 more seconds
scheduler.addTask(() => console.log("Task 3 executed"), 1000); // Then execute after 1 second

console.log("Starting scheduler...");
scheduler.start();

// Example to demonstrate pause and resume
setTimeout(() => {
  console.log("Pausing scheduler...");
  scheduler.pause();

  setTimeout(() => {
    console.log("Resuming scheduler...");
    scheduler.resume();
  }, 5000); // Resume after 5 seconds
}, 3000); // Pause after 3 seconds
