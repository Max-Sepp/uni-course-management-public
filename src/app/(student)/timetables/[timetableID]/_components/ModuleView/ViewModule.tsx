"use client";

import { BsArrowLeft } from "react-icons/bs";
import { api } from "~/trpc/react";
import { useActionContext } from "../ActionContext";

export default function ViewModule({ moduleID }: { moduleID: string }) {
  const { action, setAction } = useActionContext();

  const aModule = api.module.getModuleById.useQuery({ moduleID });

  return (
    <div className="p-5">
      <div className="mx-auto flex max-w-2xl flex-row rounded-md bg-blue p-3 text-left shadow-lg">
        <button
          onClick={() => {
            setAction(action.slice(1)); // pop from stack and go back to previous page
          }}
        >
          <BsArrowLeft size={25} />
        </button>

        {/* View details of the module */}
        <div className="flex-1 px-5">
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
          ) : undefined}
        </div>
      </div>
    </div>
  );
}
