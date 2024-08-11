import { create } from "zustand";

type DefaultStoreProps = {
  isInit: boolean;
  folderId: string;
  title: string;
  setDefaultStore: ({ id, title }: { id: string; title: string }) => void;
};

export const useDefaultStore = create<DefaultStoreProps>((set) => ({
  isInit: false,
  folderId: "",
  title: "",
  setDefaultStore: ({ id, title }) => {
    set((state) => ({ ...state, isInit: true, folderId: id, title }));
  },
}));
