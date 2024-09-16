import { createContext, useContext } from "react";
import { type Action } from "./Timetable";

export type ActionContext = {
  action: Action[];
  setAction: (c: Action[]) => void;
  timetableID: string;
  degreeID: string;
};

export const ActionContext = createContext<ActionContext>({
  action: [],
  setAction: () => {
    return;
  },
  timetableID: "",
  degreeID: "",
});

export const useActionContext = () => useContext(ActionContext);
