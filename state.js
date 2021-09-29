import create from "zustand";

const useStore = create((set) => ({
  Phonedegree: 0,
  PhoneCompass: 0,
  //   increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 })
}));

export default useStore;
