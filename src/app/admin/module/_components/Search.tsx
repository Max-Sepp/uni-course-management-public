"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import { BsPlus, BsSearch } from "react-icons/bs";
import { api } from "~/trpc/react";
import ModuleComponent from "./Module";
import Link from "next/link";

export default function Search() {
  const [animationParent] = useAutoAnimate();

  const [searchString, setSearchString] = useState<string>("");

  const moduleData = api.module.getModulesByNameModuleCode.useQuery({
    searchString,
    limit: 20,
  });

  return (
    <div className="flex flex-1 flex-col items-stretch gap-3">
      <div className="flex flex-row justify-center gap-4">
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
        <Link href="/admin/module/add" className="rounded-full bg-white">
          <BsPlus size={32} />
        </Link>
      </div>
      <li ref={animationParent} className="flex flex-col items-center gap-3">
        {moduleData.isLoading ? (
          <h3 className="mx-auto">Loading...</h3>
        ) : moduleData.isSuccess ? (
          moduleData.data.map((module, index) => (
            <ModuleComponent
              key={index}
              moduleCode={module.moduleCode}
              moduleName={module.moduleName}
            />
          ))
        ) : undefined}
      </li>
    </div>
  );
}
