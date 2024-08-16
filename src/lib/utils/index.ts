export * from "./cn";
export * from "./general";
export * from "./extract-uri";

export const retryAsyncOperation = async <T>(
  operation: () => Promise<T>,
  retries: number
): Promise<T> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      if (attempt >= retries) {
        throw error;
      }
    }
  }
  throw new Error("Failed to complete operation after retries");
};
