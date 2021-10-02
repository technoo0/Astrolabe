import create from "zustand";

const useStore = create((set) => ({
  time: 0,
  Phonedegree: 0,
  PhoneCompass: 0,
  tackphoto: () => console.log("emty"),
  //   increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 })
}));

export default useStore;
