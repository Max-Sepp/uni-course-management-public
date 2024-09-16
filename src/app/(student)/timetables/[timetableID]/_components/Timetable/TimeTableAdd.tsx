"use client";

import { useState } from "react";
import { type IValidatorIssue } from "~/server/libs/validation/IValidatorIssue";
import { ReconstructValidatorIssues } from "~/server/libs/validation/ReconstructValidatorIssues";
import { api } from "~/trpc/react";
import { type Module } from "~/types/Module";
import { useActionContext } from "../ActionContext";
import ModuleStackAdd from "./ModuleStackAdd";

export default function TimeTable({
  modules,
  lengthOfDegree,
}: {
  modules: Module[][];
  lengthOfDegree: number;
}) {
  const { timetableID } = useActionContext();

  const validate = api.validate.validatePath.useMutation();

  const [validateResult, setValidateResult] = useState<
    | {
        isSuccess: boolean;
        failures: IValidatorIssue[];
      }
    | undefined
  >(undefined);

  async function handleValidate() {
    const results = await validate.mutateAsync({ timetableID });
    const failures = ReconstructValidatorIssues(results.failures);
    setValidateResult({ isSuccess: results.isSuccess, failures });
  }

  return (
    <div className="w-full rounded-lg bg-blue p-3 shadow-lg">
      <div
        className={`${
          lengthOfDegree == 4 ? "timetable4" : "timetable3"
        } gap-3 text-center`}
      >
        <div className="w-20">Semester</div>
        <div>Year 1</div>
        <div>Year 2</div>
        <div>Year 3</div>
        {lengthOfDegree == 4 ? <div>Year 4</div> : null}
        {modules.map((val, index) => {
          return (
            <ModulesMapReturn
              key={index}
              modules={val}
              semesterDiv={index % lengthOfDegree == 0}
              index={index}
              lengthOfDegree={lengthOfDegree}
            />
          );
        })}
      </div>
      <div className="mx-auto mt-4 rounded-md bg-white p-4 text-center">
        <button className="rounded-md bg-blue p-3" onClick={handleValidate}>
          Validate
        </button>

        {validateResult == undefined ? undefined : !validateResult.isSuccess ? (
          <ul>
            {validateResult.failures.map((val, index) => (
              <li key={index}>{val.GetString()}</li>
            ))}
          </ul>
        ) : (
          <h1>No issues</h1>
        )}
      </div>
    </div>
  );
}

// Designed to contain the business logic of determining whether to add semester number
function ModulesMapReturn({
  modules,
  semesterDiv,
  index,
  lengthOfDegree,
}: {
  modules: Module[];
  semesterDiv: boolean;
  lengthOfDegree: number;
  index: number;
}) {
  if (semesterDiv) {
    return (
      <>
        <div key={index + "semester"} className="w-20">
          {index / lengthOfDegree + 1}
        </div>
        <ModuleStackAdd
          modules={modules}
          key={index}
          semester={Math.floor(index / lengthOfDegree + 1)}
          year={(index % lengthOfDegree) + 1}
        />
      </>
    );
  }

  return (
    <ModuleStackAdd
      modules={modules}
      key={index}
      semester={Math.floor(index / lengthOfDegree + 1)}
      year={(index % lengthOfDegree) + 1}
    />
  );
}
