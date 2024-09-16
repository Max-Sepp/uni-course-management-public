import { createContext, useContext } from "react";

export type ViewingContext = {
  viewingDegree: string | undefined;
  setViewingDegree: (c: string | undefined) => void;
  viewingDegreeYearStart: number | undefined;
  setViewingDegreeYearStart: (c: number | undefined) => void;
};

export const ViewingContext = createContext<ViewingContext>({
  viewingDegree: undefined,
  setViewingDegree: () => {
    return;
  },
  viewingDegreeYearStart: undefined,
  setViewingDegreeYearStart: () => {
    return;
  },
});

export const useViewingContext = () => useContext(ViewingContext);
