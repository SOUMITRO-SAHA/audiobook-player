import * as React from "react";

/**
 * Higher-order function to handle updating at a custom interval
 * @param callback `() => void`
 * @param minutes Time interval in minutes
 * @param dependencies Dependency array for the effect
 */
const useIntervalUpdate = (
  callback: () => void,
  minutes: number,
  dependencies: React.DependencyList
) => {
  React.useEffect(() => {
    const intervalCallback = () => {
      console.log("callback", callback);
      console.log("minutes", minutes);
      console.log("dependencies", dependencies);

      callback();
    };

    const intervalId = setInterval(intervalCallback, minutes * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [callback, minutes, ...dependencies]);
};

export default useIntervalUpdate;
