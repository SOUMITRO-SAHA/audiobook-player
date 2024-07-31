export interface Account {
  id: number;
  username: string | null;
  installed: boolean | null;
  theme: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Folder {
  id: number;
  name: string;
  uri: string;
  coverImage: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface LastPlaying {
  id: number;
  fileName: string;
  directory: string;
  path: string;
  timestamp: number;
}

export interface Track {
  id: number;
  folderId: string;
  dbFolderId: number | null;
  name: string;
  uri: string;
  duration: string | null;
  albumId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}
