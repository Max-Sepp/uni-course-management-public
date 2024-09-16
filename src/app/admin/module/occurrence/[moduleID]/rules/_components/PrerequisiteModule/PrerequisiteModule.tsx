"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { BsTrash3Fill } from "react-icons/bs";
import { api } from "~/trpc/react";
import AddRequiredModule from "./AddPrerequisiteModule";

export default function PrerequisiteModule({ moduleID }: { moduleID: string }) {
  const [animationParent] = useAutoAnimate();

  const modules = api.admin.rules.getPrerequisiteModulesByModuleID.useQuery({
    moduleID,
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div ref={animationParent} className="flex flex-col gap-3">
        <h2 className="h-8 text-center text-lg">
          Current Prerequisite Modules
        </h2>
        {modules.isLoading ? (
          <h3>Loading ...</h3>
        ) : modules.isSuccess ? (
          <ul className="flex flex-col gap-3">
            {modules.data.map((module, index) => (
              <Module key={index} module={module} moduleID={moduleID} />
            ))}
          </ul>
        ) : null}
      </div>
      <AddRequiredModule addingToModuleID={moduleID} />
    </div>
  );
}

function Module({
  module,
  moduleID,
}: {
  module: {
    moduleID: string;
    moduleCode: string;
    moduleName: string;
    credits: number | null;
    semester: number;
    year: number;
  };
  moduleID: string;
}) {
  const apiUtil = api.useUtils();

  const deleteRequiredModule =
    api.admin.rules.deletePrerequisiteModule.useMutation({
      onSuccess: async () => {
        await apiUtil.admin.rules.getPrerequisiteModulesByModuleID.invalidate();
      },
    });

  function handleDelete() {
    deleteRequiredModule.mutate({
      prerequisiteModule: module.moduleID,
      moduleIDRequiring: moduleID,
    });
  }

  return (
    <li className="group/module relative flex w-96 flex-col rounded-md bg-white p-2 text-left">
      <h2 className="text-md">{module.moduleName}</h2>
      <p className="text-xs">
        Module Code: {module.moduleCode} credits: {module.credits}
      </p>
      <p className="text-xs">
        Semester: {module.semester} Year: {module.year}
      </p>
      <button
        onClick={handleDelete}
        className="invisible absolute right-3 top-3 rounded-md bg-red p-1 group-hover/module:visible"
      >
        <BsTrash3Fill />
      </button>
    </li>
  );
}
