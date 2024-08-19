import { create } from "zustand";

type Queue = {
  id: string;
  title: string;
  artist: string;
  album: string;
  uri: string;
  duration: number;
  artwork?: string;
};

type QueueStore = {
  activeQueueId: string | null;
  setActiveQueueId: (queueId: string) => void;
  queue: Queue[];
  //   addTrackToQueue: (trackId: string) => void;
  //   removeTrackFromQueue: (trackId: string) => void;
  clearQueue: () => void;
};

export const useQueueStore = create<QueueStore>()((set) => ({
  activeQueueId: null,
  setActiveQueueId: (queueId) =>
    set((state) => ({ ...state, activeQueueId: queueId })),
  queue: [],
  //   addTrackToQueue: (trackId) =>
  //     set((state) => ({ ...state, queue: [...state.queue, trackId] })),
  //   removeTrackFromQueue: (trackId) =>
  //     set((state) => ({
  //       ...state,
  //       queue: state.queue.filter((id) => id !== trackId),
  //     })),
  clearQueue: () => set((state) => ({ ...state, queue: [] })),
}));

export const useQueue = () => useQueueStore((state) => state);
