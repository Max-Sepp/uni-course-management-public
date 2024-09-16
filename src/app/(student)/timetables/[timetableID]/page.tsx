"use client";

import { api } from "~/trpc/react";
import { type Module } from "~/types/Module";
import Timetable from "./_components/Timetable";

export default function Explore({
  params,
}: {
  params: { timetableID: string };
}) {
  // fetch data for timetable
  // Future work: optimise to only run one query
  const modules = api.timetable.getModulesOfPath.useQuery({
    timetableID: params.timetableID,
  });

  const degree = api.degree.getDegreeOfTimetable.useQuery({
    timetableID: params.timetableID,
  });
  const student = api.student.getStudentCurrentYear.useQuery();
  const timetableName = api.timetable.getPathName.useQuery({
    timetableID: params.timetableID,
  });

  if (
    modules.isLoading ||
    degree.isLoading ||
    student.isLoading ||
    timetableName.isLoading
  ) {
    return <h3>Loading...</h3>;
  }

  if (
    modules.isSuccess &&
    degree.isSuccess &&
    student.isSuccess &&
    timetableName.isSuccess
  ) {
    const date = new Date();

    const currentYear = date.getFullYear();

    const formattedModules: Module[][] = [];

    if (degree.data?.lengthOfDegree == null) {
      throw new Error("Degree not set");
    }

    if (student.data == undefined) {
      throw new Error("Student year cannot be found");
    }

    if (timetableName.data == undefined) {
      throw new Error("timetableName cannot be found");
    }

    let modulesData: {
      moduleID: string;
      name: string;
      moduleCode: string;
      credits: number;
      semester: number;
      year: number;
    }[];
    if (modules.data == undefined) {
      modulesData = [];
    } else {
      modulesData = modules.data;
    }

    for (let i = 0; i < degree.data.lengthOfDegree * 2; i++) {
      //assumes two semesters
      formattedModules[i] = [];
    }

    for (const aModule of modulesData) {
      if (aModule != null) {
        formattedModules[
          (aModule.semester - 1) * degree.data.lengthOfDegree +
            aModule.year -
            currentYear +
            student.data.currentYear
        ]?.push({
          moduleID: aModule.moduleID,
          moduleCode: aModule.moduleCode,
          moduleName: aModule.name,
          credits: aModule.credits,
        });
      }
    }

    return (
      <Timetable
        degreeID={degree.data.degreeID}
        studentCurrentYear={student.data.currentYear}
        modules={formattedModules}
        lengthOfDegree={degree.data.lengthOfDegree}
        timetable={{
          timetableID: params.timetableID,
          name: timetableName.data.name,
        }}
      />
    );
  }
}
