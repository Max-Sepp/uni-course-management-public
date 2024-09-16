"use client";

import { BsArrowLeft } from "react-icons/bs";
import { api } from "~/trpc/react";
import { type Module } from "~/types/Module";
import { useActionContext } from "../ActionContext";
import ModuleStack from "../Timetable/ModuleStack";
import Search from "./Search";

export default function Add({
  timetable,
  studentCurrentYear,
}: {
  timetable: {
    year: number;
    semester: number;
    timetableID: string;
    name: string;
  };
  studentCurrentYear: number;
}) {
  const { action, setAction } = useActionContext();

  const date = new Date();

  const currentYear = date.getFullYear();

  const moduleYear = currentYear - studentCurrentYear + timetable.year - 1;

  const yearStarting = currentYear - studentCurrentYear;

  const modules = api.timetable.getModulesOfPathBySemesterAndYear.useQuery({
    timetableID: timetable.timetableID,
    semester: timetable.semester,
    year: moduleYear,
  });

  const formattedModules: Module[] = [];

  if (modules.isSuccess) {
    for (const value of modules.data) {
      formattedModules.push({
        moduleID: value.moduleID,
        moduleCode: value.moduleCode,
        moduleName: value.name,
        credits: value.credits,
      });
    }
  }
  return (
    <div className="p-5">
      <div className="mx-auto flex max-w-7xl flex-row gap-3 rounded-md bg-blue p-3 shadow-lg">
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-row items-center gap-5">
            <button
              onClick={() => {
                setAction(action.slice(1)); // removes first element from front of list i.e. pop from stack and return to previous page
              }}
            >
              <BsArrowLeft size={25} />
            </button>
            <div>
              <h1>Adding to: {timetable.name}</h1>
              <h2>
                Semester: {timetable.semester} Year: {timetable.year}
              </h2>
            </div>
          </div>
          {modules.isLoading ? (
            <h3>Loading ...</h3>
          ) : modules.isSuccess ? (
            <ModuleStack modules={formattedModules} />
          ) : null}
        </div>
        <div className="flex-1">
          <Search
            yearStarting={yearStarting}
            semester={timetable.semester}
            year={moduleYear}
          />
        </div>
      </div>
    </div>
  );
}
