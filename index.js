class TaskScheduler {
  constructor() {
    this.taskQueue = [];
    this.currentTask = null;
    this.currentTaskTimer = null;
    this.paused = false;
  }

  addTask(taskFunction, delay) {
    this.taskQueue.push({ taskFunction, delay });
  }

  start() {
    if (!this.paused && this.taskQueue.length > 0 && !this.currentTask) {
      this.executeNextTask();
    } else if (this.paused && this.currentTask) {
      // Resume the current task if paused
      this.resumeCurrentTask();
    }
  }

  executeNextTask() {
    if (this.taskQueue.length === 0) {
      console.log("All tasks have been executed.");
      this.currentTask = null;
      return;
    }

    // Move the next task from the queue to current if no task is currently being executed or paused
    if (!this.currentTask) {
      this.currentTask = this.taskQueue.shift();
    }

    const { taskFunction, delay } = this.currentTask;

    this.currentTaskTimer = setTimeout(() => {
      try {
        taskFunction();
      } catch (error) {
        console.error('Task execution error:', error);
      }
      this.currentTask = null; // Clear current task after execution
      this.executeNextTask(); // Proceed to next task
    }, delay);
  }

  pause() {
    if (this.currentTaskTimer) {
      clearTimeout(this.currentTaskTimer);
      this.paused = true;
      const elapsedTime = Date.now() - this.currentTaskStartTime;
      // Adjust remaining time for the current task
      this.currentTask.delay -= elapsedTime;
    }
  }

  resume() {
    this.paused = false;
    // Immediately resume with the adjusted delay
    this.executeNextTask();
  }

  cancel() {
    clearTimeout(this.currentTaskTimer);
    this.taskQueue = [];
    this.currentTask = null;
    this.paused = false;
    console.log("Scheduler canceled. All pending tasks have been removed.");
  }
}


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
