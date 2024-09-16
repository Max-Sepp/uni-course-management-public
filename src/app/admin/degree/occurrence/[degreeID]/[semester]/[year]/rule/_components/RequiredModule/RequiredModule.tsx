"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import { BsArrowLeft, BsTrash3Fill } from "react-icons/bs";
import { api } from "~/trpc/react";
import AddRequiredModule from "./AddRequiredModule";

export default function RequireModule({
  degreeID,
  occurring,
}: {
  degreeID: string;
  occurring: { semester: number; year: number };
}) {
  const modules =
    api.admin.rules.getDegreeRequiredModuleByDegreeIDFilterSemesterYear.useQuery(
      {
        degreeID,
        semester: occurring.semester,
        year: occurring.year,
      },
    );

  const degree = api.degree.getDegreeByDegreeID.useQuery({ degreeID });

  const [animationParent] = useAutoAnimate();

  return (
    <div className=" grid grid-cols-2 gap-4">
      <div ref={animationParent} className="flex flex-col gap-3">
        <div className="flex flex-row items-center gap-5">
          <Link
            href={`/admin/degree/${
              degree.data == undefined ? "" : degree.data.degreeCode
            }`}
          >
            <BsArrowLeft size={25} />
          </Link>
          <div>
            <h1>
              Adding to:{" "}
              {degree.isLoading ? (
                <>Loading...</>
              ) : degree.isSuccess ? (
                degree.data?.name
              ) : undefined}
            </h1>
            <h2>
              Semester: {occurring.semester} Year: {occurring.year}
            </h2>
          </div>
        </div>
        <h2 className="h-8 text-center text-lg">Modules Already Required</h2>
        <ul className="flex flex-col gap-3">
          {modules.isLoading ? (
            <h3>Loading ...</h3>
          ) : modules.isSuccess ? (
            <>
              {modules.data.map((module, index) => (
                <Module key={index} degreeID={degreeID} module={module} />
              ))}
            </>
          ) : null}
        </ul>
      </div>
      <AddRequiredModule addingToDegreeID={degreeID} occurring={occurring} />
    </div>
  );
}

function Module({
  module,
  degreeID,
}: {
  module: {
    moduleID: string;
    moduleCode: string;
    moduleName: string;
    credits: number;
  };
  degreeID: string;
}) {
  const apiUtil = api.useUtils();

  const deleteRequiredModule =
    api.admin.rules.deleteDegreeRequiredModule.useMutation({
      onSuccess: async () => {
        await apiUtil.admin.rules.getDegreeRequiredModuleByDegreeIDFilterSemesterYear.invalidate();
      },
    });

  function handleDelete() {
    deleteRequiredModule.mutate({ degreeID, moduleID: module.moduleID });
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
