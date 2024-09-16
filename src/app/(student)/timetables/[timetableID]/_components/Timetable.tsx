"use client";

import { useState } from "react";
import TimeTable from "./Timetable/TimeTableAdd";
import Add from "./Add/Add";
import { ActionContext } from "./ActionContext";
import ViewModule from "./ModuleView/ViewModule";
import { type Module } from "~/types/Module";
import TimetableDetails from "./Timetable/TimetableDetails";

export type Action = {
  type: "view" | "add" | "delete";
  year: number;
  semester: number;
  moduleID: string;
};

export default function Timetable({
  degreeID,
  modules,
  lengthOfDegree,
  timetable,
  studentCurrentYear,
}: {
  degreeID: string;
  modules: Module[][];
  lengthOfDegree: number;
  timetable: { timetableID: string; name: string };
  studentCurrentYear: number;
}) {
  const [action, setAction] = useState<Action[]>([]);

  return (
    <ActionContext.Provider
      value={{
        action,
        setAction,
        timetableID: timetable.timetableID,
        degreeID,
      }}
    >
      {action[0] == undefined ? (
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 p-3">
          <TimetableDetails
            degreeID={degreeID}
            timetableName={timetable.name}
          />
          <TimeTable modules={modules} lengthOfDegree={lengthOfDegree} />
        </div>
      ) : action[0].type == "add" ? (
        <Add
          timetable={{
            year: action[0].year,
            semester: action[0].semester,
            timetableID: timetable.timetableID,
            name: timetable.name,
          }}
          studentCurrentYear={studentCurrentYear}
        />
      ) : action[0].type == "view" ? (
        <ViewModule moduleID={action[0].moduleID} />
      ) : undefined}
    </ActionContext.Provider>
  );
}
