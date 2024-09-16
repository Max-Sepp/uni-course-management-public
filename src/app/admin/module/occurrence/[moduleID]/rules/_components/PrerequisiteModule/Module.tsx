"use clients";

import { BsPlusLg } from "react-icons/bs";
import { api } from "~/trpc/react";

export default function ModuleComponent({
  module,
  addingToModuleID,
}: {
  module: {
    moduleID: string;
    moduleCode: string;
    moduleName: string;
    credits: number | null;
    semester: number;
    year: number;
  };
  addingToModuleID: string;
}) {
  const apiUtil = api.useUtils();

  const addRequiredModule = api.admin.rules.addPrerequisiteModule.useMutation({
    onSuccess: async () => {
      await apiUtil.admin.rules.getPrerequisiteModulesByModuleID.invalidate();
    },
  });

  function handleAdd() {
    addRequiredModule.mutate({
      prerequisiteModule: module.moduleID,
      moduleRequiring: addingToModuleID,
    });
  }

  return (
    <div className="flex w-96 flex-row rounded-md bg-white p-2 text-left">
      <div className="flex grow flex-col">
        <h2 className="text-md">{module.moduleName}</h2>
        <p className="text-xs">
          Module Code: {module.moduleCode} credits: {module.credits}
        </p>
        <p className="text-xs">
          Semester: {module.semester} Year: {module.year}
        </p>
      </div>
      <button
        onClick={handleAdd}
        className="self-center rounded-md bg-white p-1 hover:bg-blue"
      >
        <BsPlusLg />
      </button>
    </div>
  );
}
