import { createContext, useContext } from "react";

export type ViewingContext = {
  viewingModule: string | undefined;
  setViewingModule: (c: string | undefined) => void;
};

export const ViewingContext = createContext<ViewingContext>({
  viewingModule: undefined,
  setViewingModule: () => {
    return;
  },
});

export const useViewingContext = () => useContext(ViewingContext);
