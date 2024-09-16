"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { api } from "~/trpc/react";
import ModuleComponent from "./Module";

export default function AddPrerequisiteModule({
  addingToModuleID,
}: {
  addingToModuleID: string;
}) {
  const [animationParent] = useAutoAnimate();

  const [searchString, setSearchString] = useState<string>("");

  const moduleData = api.module.getModuleOccurrenceByNameModuleCode.useQuery({
    searchString,
    limit: 20,
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
              module={module}
              addingToModuleID={addingToModuleID}
            />
          ))
        ) : undefined}
      </li>
    </div>
  );
}
