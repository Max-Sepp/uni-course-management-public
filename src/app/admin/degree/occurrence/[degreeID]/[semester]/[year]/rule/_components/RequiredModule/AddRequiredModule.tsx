"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { api } from "~/trpc/react";
import ModuleComponent from "./Module";

export default function AddRequiredModule({
  addingToDegreeID,
  occurring,
}: {
  addingToDegreeID: string;
  occurring: { semester: number; year: number };
}) {
  const [animationParent] = useAutoAnimate();

  const [searchString, setSearchString] = useState<string>("");

  const moduleData =
    api.module.getModuleOccurrenceByNameModuleCodeFilterSemesterYear.useQuery({
      searchString: searchString,
      limit: 20,
      semester: occurring.semester,
      year: occurring.year,
    });

  return (
    <div className="flex flex-col gap-3">
      <form className="flex-intial flex w-96 flex-row items-center gap-4 rounded-md bg-white px-2">
        <BsSearch />
        <input
          className="grow py-1 focus:outline-none"
          type="text"
          value={searchString}
          spellCheck={true}
          onChange={(e) => setSearchString(e.target.value)}
        />
      </form>
      <li ref={animationParent} className="flex flex-col gap-3">
        {moduleData.isLoading ? (
          <h3 className="mx-auto">Loading...</h3>
        ) : moduleData.isSuccess ? (
          moduleData.data.map((module, index) => (
            <ModuleComponent
              key={index}
              moduleID={module.moduleID}
              moduleCode={module.moduleCode}
              moduleName={module.moduleName}
              credits={module.credits}
              semester={module.semester}
              year={module.year}
              addingToDegreeID={addingToDegreeID}
            />
          ))
        ) : undefined}
      </li>
    </div>
  );
}
