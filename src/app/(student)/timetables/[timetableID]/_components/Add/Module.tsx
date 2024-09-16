"use client";

import { BsPlusLg } from "react-icons/bs";
import { api } from "~/trpc/react";
import { useActionContext } from "../ActionContext";

export default function ModuleComponent({
  moduleID,
  moduleCode,
  moduleName,
  credits,

  moduleLevel,
}: {
  moduleID: string;
  moduleCode: string;
  moduleName: string;
  credits: number;

  moduleLevel: number;
}) {
  const apiUtils = api.useUtils();

  const { action, setAction, timetableID } = useActionContext();

  function handleView() {
    setAction([{ type: "view", semester: -1, year: -1, moduleID }, ...action]); // push to front of list view which is push to stack i.e. go to view page
  }

  const addModuleMutation = api.timetable.addModuleToPath.useMutation({
    onSuccess: async () => {
      await apiUtils.timetable.getModulesOfPathBySemesterAndYear.invalidate();
      await apiUtils.timetable.getModulesOfPath.invalidate();
    },
  });

  function handleAdd() {
    addModuleMutation.mutate({ timetableID, moduleID });
  }

  return (
    <div className="relative flex flex-col rounded-md bg-white p-2 text-left">
      <h2 onClick={handleView} className="text-md hover:underline">
        {moduleName}
      </h2>
      <p className="text-xs">
        Module Code: {moduleCode} Credits: {credits} Level: {moduleLevel}
      </p>
      <button
        onClick={handleAdd}
        className="absolute right-3 top-3 rounded-md bg-white p-1 hover:bg-blue"
      >
        <BsPlusLg />
      </button>
    </div>
  );
}
