"use client";
import { api } from "~/trpc/react";
import Occurrence from "./Occurrence";

export function Occuring({ moduleCode }: { moduleCode: string }) {
  const timesModuleOccur =
    api.admin.module.getSpecificModulesByModuleCode.useQuery({
      moduleCode,
    });

  if (timesModuleOccur.isLoading) {
    return (
      <div className="mx-auto w-[42rem] rounded-md bg-blue p-3 text-left shadow-lg">
        <h2 className="bold text-md text-center">Loading...</h2>
      </div>
    );
  }

  if (timesModuleOccur.isSuccess) {
    if (timesModuleOccur.data.length == 0) {
      return (
        <div className="mx-auto w-[42rem] rounded-md bg-blue p-3 text-left shadow-lg">
          <h2 className="bold text-md text-center">
            Has no times when the module has happened or is going to happen
          </h2>
        </div>
      );
    }

    timesModuleOccur.data.sort(
      (a, b) => b.semester - a.semester + 10 * (b.year - a.year),
    );
    return (
      <ul className=" flex flex-col gap-3">
        {timesModuleOccur.data.map((val, index) => (
          <Occurrence key={index} moduleOccurrence={val} />
        ))}
      </ul>
    );
  }
}
