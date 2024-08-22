import { create } from "zustand";

type CounterStore = {
  count: number;
  setCount: (value: number) => void;
};

const useCounterStore = create<CounterStore>()((set) => ({
  count: 0,
  setCount: (value: number) => set((state) => ({ count: value })),
}));

export const useCounter = () => useCounterStore((state) => state);
