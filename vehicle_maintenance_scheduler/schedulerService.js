import { log } from "../logging_middleware/logger.js";

/**
 * tasks: [{ TaskID, Duration, Impact }]
 * capacity: number (mechanic hours)
 */
export function scheduleTasks(tasks, capacity) {
  const n = tasks.length;

  // dp[i][w] = max impact using first i items with capacity w
  const dp = Array.from({ length: n + 1 }, () =>
    Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const { Duration, Impact } = tasks[i - 1];

    for (let w = 0; w <= capacity; w++) {
      if (Duration <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - Duration] + Impact
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // backtrack to find selected tasks
  let w = capacity;
  const selected = [];

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(tasks[i - 1]);
      w -= tasks[i - 1].Duration;
    }
  }

  const totalImpact = dp[n][capacity];
  const usedHours = selected.reduce((s, t) => s + t.Duration, 0);

  log("backend", "info", "service", `scheduler done: impact=${totalImpact}, hours=${usedHours}`);

  return {
    totalImpact,
    usedHours,
    selectedTasks: selected.reverse()
  };
}