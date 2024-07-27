export interface Account {
  id: number;
  username: string;
  installed: boolean | null;
  theme: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PermittedFolder {
  id: number;
  name: string;
  uri: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Folder {
  id: number;
  name: string;
  uri: string;
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
  fileName: string;
  directory: string;
  path: string;
}
