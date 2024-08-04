export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

/**
 * Extracts the `sub-folder` name from a given URI.
 *
 * @param uri - The URI string to extract the `sub-folder` name from.
 * @returns The extracted `sub-folder` name, or null if extraction fails.
 */
export const extractSubFolderNameFromUri = (uri: string): string | null => {
  try {
    console.log("URI ===>", uri);
    // Decode the URI
    const decodedUri = decodeURIComponent(uri);

    // Split the decoded URI into segments by the '/' character.
    const segments = decodedUri.split("/");

    // Extract the last segment of the URI
    const lastSegment = segments.pop();

    // Return the `last segment` or `null` if it is not available.
    return lastSegment || null;
  } catch (error) {
    console.error(`Error extracting subfolder name from URI:`, error);
    return null;
  }
};

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.round(seconds % 60);

  const pad = (num: number): string => (num < 10 ? "0" + num : num.toString());

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  } else {
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
