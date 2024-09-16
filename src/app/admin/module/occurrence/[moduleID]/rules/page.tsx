"use client";

import { useState } from "react";
import PrerequisiteModule from "./_components/PrerequisiteModule/PrerequisiteModule";
import NotSameTime from "./_components/NotSameTime/NotSameTime";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { api } from "~/trpc/react";

export default function DegreeRule({
  params,
}: {
  params: { moduleID: string };
}) {
  const aModule = api.module.getModuleById.useQuery({
    moduleID: params.moduleID,
  });

  const [addingWhatRule, setAddingRule] = useState("prerequisiteModule");

  return (
    <div className="min-w-2xl mx-auto mt-4 flex w-fit flex-col items-center gap-2 rounded-md bg-blue p-2">
      <div className="flex flex-row">
        <Link href={`/admin/module/${aModule.data?.moduleCode}`}>
          <BsArrowLeft size={25} />
        </Link>
        <div className="px-5">
          {aModule.isLoading ? (
            <h1 className="bold text-center text-xl">Loading...</h1>
          ) : aModule.isSuccess ? (
            <>
              <h1 className="bold text-center text-xl">
                Module: {aModule.data?.moduleName}
              </h1>
              <p className="text-center text-xs">
                Credits: {aModule.data?.credits}
              </p>
              <p>{aModule.data?.moduleDescription}</p>
              <p className="text-sm">ModuleCode: {aModule.data?.moduleCode}</p>
              <p className="text-sm">
                Semester: {aModule.data?.semester} Year: {aModule.data?.year}
              </p>
            </>
          ) : null}
        </div>
      </div>
      <nav className="flex flex-row gap-4 ">
        <button
          onClick={() => setAddingRule("prerequisiteModule")}
          className={`rounded-md p-2 hover:underline ${
            addingWhatRule == "prerequisiteModule" ? "bg-white" : "bg-blue"
          }`}
        >
          Prerequisite Module
        </button>
        <button
          onClick={() => setAddingRule("notSameTime")}
          className={`rounded-md p-2  hover:underline ${
            addingWhatRule == "notSameTime" ? "bg-white" : "bg-blue"
          }`}
        >
          Module Not Taken at Same Time
        </button>
      </nav>
      {addingWhatRule == "prerequisiteModule" ? (
        <PrerequisiteModule moduleID={params.moduleID} />
      ) : (
        <NotSameTime moduleID={params.moduleID} />
      )}
    </div>
  );
}
