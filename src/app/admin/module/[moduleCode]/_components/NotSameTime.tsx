"use client";

import { api } from "~/trpc/react";
import ModuleComponent from "./ModuleComponent";
import { useViewingContext } from "../ViewingContext";

export default function NotSameTimeModule() {
  const { viewingModule } = useViewingContext();

  if (viewingModule == undefined) {
    throw new Error(
      "viewingModule undefined in not same time module component",
    );
  }

  const modules = api.admin.rules.getNotSameTimeModuleByModuleID.useQuery({
    moduleID: viewingModule,
  });

  return (
    <>
      <h2 className="h-8 text-center text-lg">Modules Already Required</h2>
      {modules.isLoading ? (
        <h3>Loading ...</h3>
      ) : modules.isSuccess && modules.data.length > 0 ? (
        <ul className="grid grid-cols-3 gap-3">
          {modules.data.map((module, index) => (
            <ModuleComponent key={index} module={module} />
          ))}
        </ul>
      ) : modules.isSuccess ? (
        <h3>No Not Same Time Modules are present for this Module Occurrence</h3>
      ) : null}
    </>
  );
}
