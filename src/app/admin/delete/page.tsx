"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import ModuleForm from "./_deleteForm/ModuleForm";
import ModuleOccurrenceForm from "./_deleteForm/ModuleOccurrenceForm";
import DegreeForm from "./_deleteForm/DegreeForm";
import DegreeOccurrenceForm from "./_deleteForm/DegreeOccurrenceForm";
import DepartmentForm from "./_deleteForm/DepartmentForm";

export default function Delete() {
  const [animationParent] = useAutoAnimate();

  const [deletingWhat, setDeletingWhat] = useState("module");

  return (
    <div
      ref={animationParent}
      className="mx-auto mt-4 flex w-[48rem] flex-col items-center gap-2 rounded-md border-4 border-red bg-blue p-2"
    >
      <h1 className="text-center text-xl">Delete</h1>
      <form className="flex flex-col">
        <label>What do you want to delete?</label>
        <select
          value={deletingWhat}
          onChange={(e) => setDeletingWhat(e.target.value)}
        >
          <option value="module">Module</option>
          <option value="moduleOccurrence">Module Occurrence</option>
          <option value="degree">Degree</option>
          <option value="degreeOccurrence">Degree Occurrence</option>
          <option value="department">Department</option>
        </select>
      </form>
      {deletingWhat == "module" ? (
        <ModuleForm />
      ) : deletingWhat == "moduleOccurrence" ? (
        <ModuleOccurrenceForm />
      ) : deletingWhat == "degree" ? (
        <DegreeForm />
      ) : deletingWhat == "degreeOccurrence" ? (
        <DegreeOccurrenceForm />
      ) : deletingWhat == "department" ? (
        <DepartmentForm />
      ) : undefined}
    </div>
  );
}
