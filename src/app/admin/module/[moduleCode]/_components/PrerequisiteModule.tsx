"use client";

import { api } from "~/trpc/react";
import { useViewingContext } from "../ViewingContext";
import ModuleComponent from "./ModuleComponent";

export default function PrerequisiteModule() {
  const { viewingModule } = useViewingContext();

  if (viewingModule == undefined) {
    throw new Error("viewingModule undefined in prerequisite module component");
  }

  const modules = api.admin.rules.getPrerequisiteModulesByModuleID.useQuery({
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
        <h3>No Prerequiste Modules are present for this Module Occurrence</h3>
      ) : null}
    </>
  );
}
