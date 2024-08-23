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

export function extractName(input: string, removeWords?: string[]): string {
  // Step 1: Remove file extension
  let withoutExtension = input.replace(/\.[a-zA-Z0-9]+$/, "");

  // Step 2: Remove text within parentheses (including parentheses)
  withoutExtension = withoutExtension.replace(/\(.*?\)/g, "");

  // Step 3: Remove years (e.g., 2019, 2020)
  withoutExtension = withoutExtension.replace(/\b\d{4}\b/g, "");

  // Step 4: Replace multiple hyphens or underscores with spaces, but keep a single hyphen
  let withSpaces = withoutExtension.replace(/[-_]+/g, " ");

  // Step 5: Retain a single hyphen if it exists
  withSpaces = withSpaces.replace(/([^-])-(?=[^-])/g, "$1-"); // Retain single hyphen between words

  // Step 6: Remove specified words (if provided)
  if (removeWords && removeWords.length > 0) {
    const pattern = new RegExp(`\\b(${removeWords.join("|")})\\b`, "gi");
    withSpaces = withSpaces.replace(pattern, "");
  }

  // Step 7: Remove special characters except for single hyphen and spaces
  let cleaned = withSpaces.replace(/[^a-zA-Z0-9\s-]/g, "");

  // Step 8: Trim leading/trailing whitespace and normalize spaces
  cleaned = cleaned.trim().replace(/\s+/g, " ");

  return cleaned;
}
