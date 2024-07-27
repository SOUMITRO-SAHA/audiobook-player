export const extractUriToGetName = (uri: string) => {
  if (uri.includes("%3A")) {
    const folderName = uri.split("%3A").pop();
    return folderName;
  }
  return "Unknown";
};
