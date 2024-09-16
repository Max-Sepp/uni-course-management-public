"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { api } from "~/trpc/react";
import { useActionContext } from "../ActionContext";
import ModuleComponent from "./Module";

export default function Search({
  semester,
  year,
  yearStarting,
}: {
  semester: number;
  year: number;
  yearStarting: number;
}) {
  const [animationParent] = useAutoAnimate();

  const [searchString, setSearchString] = useState<string>("");

  const { degreeID } = useActionContext();

  // Filter
  const [moduleLevelFilter, setModuleLevelFilter] = useState<
    "oneLevel" | "plusMinusOneLevel" | "noFilter"
  >("oneLevel");

  const moduleData =
    api.module.getModuleByNameModuleCodeFilterSemesterYearModuleLevel.useQuery({
      searchString: searchString,
      limit: 10,
      semester,
      year,
      degreeID,
      yearStarting,
      moduleLevelFilter,
    });

  return (
    <div className="flex flex-1 flex-col items-stretch gap-3">
      <div className="flex min-h-[3rem] flex-row items-center justify-center gap-3">
        {/* Search bar */}
        <form className="flex-intial flex w-96 flex-row items-center gap-4 rounded-md bg-white px-2">
          <BsSearch />
          <input
            className="w-96 flex-initial py-1 focus:outline-none"
            type="text"
            value={searchString}
            spellCheck={true}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </form>

        {/* Filter button */}
        <form className="w-fit rounded-md bg-white p-1">
          <label>Filter By: </label>
          <select
            className="w-28 focus:outline-none"
            value={moduleLevelFilter}
            onChange={(e) => {
              if (
                e.target.value == "oneLevel" ||
                e.target.value == "plusMinusOneLevel" ||
                e.target.value == "noFilter"
              ) {
                setModuleLevelFilter(e.target.value);
              }
            }}
          >
            {/* i.e. only the current level  */}
            <option value="oneLevel">One Level</option>
            <option value="plusMinusOneLevel">±1 Level</option>
            <option value="noFilter">No Filter</option>
          </select>
        </form>
      </div>

      {/* List of modules */}
      <li ref={animationParent} className="flex flex-col gap-3">
        {moduleData.isLoading ? (
          <h3 className="mx-auto">Loading...</h3>
        ) : moduleData.isSuccess ? (
          moduleData.data.map((module) => (
            <ModuleComponent
              key={module.moduleID}
              moduleID={module.moduleID}
              moduleCode={module.moduleCode}
              moduleName={module.moduleName}
              credits={module.credits}
              moduleLevel={module.moduleLevel}
            />
          ))
        ) : undefined}
      </li>
    </div>
  );
}
