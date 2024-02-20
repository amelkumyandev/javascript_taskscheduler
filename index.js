class TaskScheduler {
  constructor() {
    this.taskQueue = [];
    this.currentTask = null;
    this.currentTaskTimer = null;
    this.paused = false;
    this.currentTaskStartTime = null; // Initialize the start time tracking
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
    if (this.taskQueue.length === 0 && !this.currentTask) {
      if (!this.isRunning()) {
        console.log("All tasks have been executed.");
      }
      return;
    }

    if (!this.currentTask) {
      this.currentTask = this.taskQueue.shift();
    }

    const { taskFunction, delay } = this.currentTask;
    this.currentTaskStartTime = Date.now(); // Set start time for current task

    this.currentTaskTimer = setTimeout(() => {
      try {
        taskFunction();
      } catch (error) {
        console.error('Task execution error:', error);
      }
      this.currentTask = null; // Clear current task after execution
      if (this.taskQueue.length > 0 || this.currentTask) {
        this.executeNextTask(); // Proceed to next task only if there are more tasks or a current task
      } else {
        console.log("All tasks have been executed."); // Moved inside condition
      }
    }, delay);
  }

  pause() {
    if (this.currentTaskTimer) {
      clearTimeout(this.currentTaskTimer);
      this.paused = true;
      const elapsedTime = Date.now() - this.currentTaskStartTime;
      // Adjust remaining time for the current task
      if (this.currentTask) { // Ensure currentTask exists before adjusting
        this.currentTask.delay -= elapsedTime;
      }
    }
  }

  resume() {
    if (this.paused && this.currentTask) { // Check if there's a current task when resuming
      this.paused = false;
      this.executeNextTask(); // Resume or start next task
    }
  }

  cancel() {
    clearTimeout(this.currentTaskTimer);
    this.taskQueue = [];
    this.currentTask = null;
    this.paused = false;
    console.log("Scheduler canceled. All pending tasks have been removed.");
  }

  isRunning() {
    return this.currentTaskTimer !== null;
  }
}

// Usage example remains the same



const scheduler = new TaskScheduler();

scheduler.addTask(() => console.log("Task 1 executed"), 2000); // Execute after 2 seconds
scheduler.addTask(() => console.log("Task 2 executed"), 3000); // Then execute after 3 more seconds
scheduler.addTask(() => console.log("Task 3 executed"), 1000); // Then execute after 1 second
scheduler.addTask(() => console.log("Task 4 executed"), 7000); // Then execute after 7 second


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
   scheduler.pause();
    setTimeout(() => {
    console.log("Resuming scheduler...");
    scheduler.resume();
  }, 7000); // Resume after 7 seconds
}, 3000); // Pause after 3 seconds

