/**
 * Smart Priority Engine
 * 
 * Computes a dynamic priority score based on:
 * 1. Overdue status (Critical/Highest)
 * 2. Proximity to deadline (High/Medium)
 * 3. Tie-breaker: creation date
 */
exports.computePriority = (tasks) => {
  const now = new Date();

  return tasks
    .map((task) => {
      const deadline = new Date(task.deadline);
      const createdAt = new Date(task.createdAt);
      
      let priorityScore = 0;
      const msUntilDeadline = deadline - now;
      const hoursUntilDeadline = msUntilDeadline / (1000 * 60 * 60);

      if (task.status === 'completed') {
        priorityScore = 0; // Low priority
      } else if (msUntilDeadline < 0) {
        // OVERDUE: Base score 1000 + 10 for every hour overdue
        priorityScore = 1000 + Math.abs(hoursUntilDeadline) * 10;
      } else {
        // UPCOMING:
        // Score = 1000 / (hours + 1) -> Exponentially increases as hours approach 0
        // Capped to keep it below overdue tasks
        priorityScore = Math.min(999, 1000 / (Math.max(0.1, hoursUntilDeadline)));
      }

      return {
        ...task.toObject(),
        priorityScore: Math.round(priorityScore),
      };
    })
    .sort((a, b) => {
      // 1. Primary: Priority score descending
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      // 2. Secondary: Earlier created first (FIFO)
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
};
