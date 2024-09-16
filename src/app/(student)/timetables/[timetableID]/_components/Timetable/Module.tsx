"use client";

import { BsTrash3Fill } from "react-icons/bs";
import { api } from "~/trpc/react";
import { type Module } from "~/types/Module";
import { useActionContext } from "../ActionContext";

export default function ModuleComponent({
  moduleID,
  moduleCode,
  moduleName,
  credits,
}: Module) {
  const apiUtils = api.useUtils();

  const { action, setAction, timetableID } = useActionContext();

  function handleView() {
    setAction([{ type: "view", semester: -1, year: -1, moduleID }, ...action]); // go to view page
  }

  const deleteMutation = api.timetable.deleteModuleFromPath.useMutation({
    onSuccess: async () => {
      await apiUtils.timetable.getModulesOfPathBySemesterAndYear.invalidate();
      await apiUtils.timetable.getModulesOfPath.invalidate();
    },
  });

  function handleDelete() {
    deleteMutation.mutate({ timetableID, moduleID });
  }

  return (
    <li className="group/module relative flex flex-col rounded-md bg-white p-2 text-left">
      <h2 onClick={handleView} className="text-md hover:underline">
        {moduleName}
      </h2>
      <p className="text-xs">
        Module Code: {moduleCode} credits: {credits}
      </p>
      <button
        onClick={handleDelete}
        className="invisible absolute right-3 top-3 rounded-md bg-red p-1 group-hover/module:visible"
      >
        <BsTrash3Fill />
      </button>
    </li>
  );
}
