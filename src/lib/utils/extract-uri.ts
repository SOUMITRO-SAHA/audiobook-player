export const extractUriToGetName = (uri: string) => {
  let encodedUri = decodeURIComponent(uri);

  if (uri.includes("/")) {
    const folderName = encodedUri.split("/").pop();
    return folderName;
  }
  return "Unknown";
};
