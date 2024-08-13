// TODO: Add Background Process
import * as React from "react";

export const useDelayedTask = (delay: number | null, task: () => void) => {
  if (delay) {
    React.useEffect(() => {
      const timeoutId = setTimeout(task, delay);

      return () => clearTimeout(timeoutId);
    }, [delay, task]);
  }
};
