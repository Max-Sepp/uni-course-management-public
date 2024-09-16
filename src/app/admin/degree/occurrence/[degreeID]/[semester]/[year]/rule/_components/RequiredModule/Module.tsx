"use clients";

import { BsPlusLg } from "react-icons/bs";
import { api } from "~/trpc/react";

type Module = {
  moduleID: string;
  moduleCode: string;
  moduleName: string;
  credits: number;
  semester: number;
  year: number;
  addingToDegreeID: string;
};

export default function ModuleComponent({
  moduleID,
  moduleCode,
  moduleName,
  credits,
  addingToDegreeID,
}: Module) {
  const apiUtil = api.useUtils();

  const addRequiredModule = api.admin.rules.addDegreeRequiredModule.useMutation(
    {
      onSuccess: async () => {
        await apiUtil.admin.rules.getDegreeRequiredModuleByDegreeIDFilterSemesterYear.invalidate();
      },
    },
  );

  function handleAdd() {
    addRequiredModule.mutate({
      degreeID: addingToDegreeID,
      moduleID,
    });
  }

  return (
    <div className="flex w-96 flex-row rounded-md bg-white p-2 text-left">
      <div className="flex grow flex-col">
        <h2 className="text-md">{moduleName}</h2>
        <p className="text-xs">
          Module Code: {moduleCode} Credits: {credits}
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
