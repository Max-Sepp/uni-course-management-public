"use client";

import { api } from "~/trpc/react";
import TimeTable from "./TimeTable";

import { type Module } from "./ModuleComponent";

export default function ViewingOccurrenceRules({
  degreeID,
}: {
  degreeID: string;
}) {
  const degreeRequiredModule =
    api.admin.rules.getDegreeRequiredModuleByDegreeID.useQuery({
      degreeID,
    });

  const degree = api.admin.degree.getDegreeByDegreeID.useQuery({
    degreeID,
  });

  const formattedModules: Module[][] = [];

  if (degree.isLoading || degreeRequiredModule.isLoading) {
    return <h1>Loading...</h1>;
  }
  if (degreeRequiredModule.isSuccess && degree.isSuccess) {
    for (let i = 0; i < degree.data?.degreeLength * 2; i++) {
      //assumes two semesters
      formattedModules[i] = [];
    }

    for (const aModule of degreeRequiredModule.data) {
      if (aModule != null) {
        formattedModules[
          (aModule.semester - 1) * degree.data.degreeLength +
            aModule.year -
            degree.data.yearStarting
        ]?.push({
          moduleID: aModule.moduleID,
          moduleCode: aModule.moduleCode,
          moduleName: aModule.moduleName,
          credits: aModule.credits,
          semester: aModule.semester,
          year: aModule.year,
        });
      }
    }

    return (
      <TimeTable
        degreeID={degreeID}
        modules={formattedModules}
        lengthOfDegree={degree.data.degreeLength}
      />
    );
  }
}

function Module({
  module,
}: {
  module: {
    moduleID: string;
    moduleCode: string;
    moduleName: string;
    credits: number;
  };
}) {
  return (
    <li className="relative flex w-96 flex-col rounded-md bg-white p-2 text-left">
      <h2 className="text-md">{module.moduleName}</h2>
      <p className="text-xs">
        Module Code: {module.moduleCode} credits: {module.credits}
      </p>
    </li>
  );
}
