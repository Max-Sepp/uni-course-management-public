"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { BsTrash3Fill } from "react-icons/bs";
import { api } from "~/trpc/react";
import AddNotSameTimeModule from "./AddNotSameTimeModule";

export default function NotSameTime({ moduleID }: { moduleID: string }) {
  const modules = api.admin.rules.getNotSameTimeModuleByModuleID.useQuery({
    moduleID,
  });
  const [animationParent] = useAutoAnimate();
  return (
    <div className="grid grid-cols-2 gap-4">
      <div ref={animationParent} className="flex flex-col gap-3">
        <h2 className="h-8 text-center text-lg">Modules Already Required</h2>
        {modules.isLoading ? (
          <h3>Loading ...</h3>
        ) : modules.isSuccess ? (
          <ul className="flex flex-col gap-3">
            {modules.data.map((module, index) => (
              <Module key={index} moduleID={moduleID} module={module} />
            ))}
          </ul>
        ) : null}
      </div>
      <AddNotSameTimeModule addingToModuleID={moduleID} />
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
    credits: number;
  };
  moduleID: string;
}) {
  const apiUtil = api.useUtils();

  const deleteRequiredModule =
    api.admin.rules.deleteNotSameTimeByModuleCode.useMutation({
      onSuccess: async () => {
        await apiUtil.admin.rules.getNotSameTimeModuleByModuleID.invalidate();
      },
    });

  function handleDelete() {
    deleteRequiredModule.mutate({
      module1: moduleID,
      module2: module.moduleID,
    });
  }

  return (
    <li className="group/module relative flex w-96 flex-col rounded-md bg-white p-2 text-left">
      <h2 className="text-md">{module.moduleName}</h2>
      <p className="text-xs">
        Module Code: {module.moduleCode} credits: {module.credits}
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
