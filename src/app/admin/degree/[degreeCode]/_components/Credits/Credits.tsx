"use client";

import { api } from "~/trpc/react";
import AddCredit from "./AddCredit";

export default function Credits({
  degreeID,
}: {
  degreeID: string;
  degreeCode: string;
}) {
  const degree = api.degree.getDegreeByDegreeID.useQuery({
    degreeID,
  });

  const currentCredits = api.admin.rules.getCreditsForDegreeByDegreeID.useQuery(
    { degreeID },
  );

  const creditsRequired: {
    degreeID: string;
    semester: number;
    year: number;
    creditsRequired: number | undefined;
    moduleLevel: number | undefined;
  }[] = [];

  if (
    degree.isSuccess &&
    degree.data != undefined &&
    currentCredits.isSuccess &&
    currentCredits.data != undefined
  ) {
    for (let i = 0; i < degree.data.lengthOfDegree * 2; i++) {
      creditsRequired.push({
        degreeID,
        creditsRequired: currentCredits.data.find(
          (val) =>
            val.semester == (i % 2) + 1 && val.year == Math.floor(i / 2) + 1,
        )?.creditsRequired,
        semester: (i % 2) + 1,
        year: Math.floor(i / 2) + 1,
        moduleLevel: currentCredits.data.find(
          (val) =>
            val.semester == (i % 2) + 1 && val.year == Math.floor(i / 2) + 1,
        )?.moduleLevel,
      });
    }
  }

  return (
    <div className="flex-1 px-5 text-center">
      <h1 className="bold mb-2 text-center text-xl">
        Add/Edit Credits to Degree
      </h1>
      {degree.isLoading || currentCredits.isLoading ? (
        <h1>Loading...</h1>
      ) : degree.isSuccess ? (
        <AddCredit creditsRequired={creditsRequired} />
      ) : undefined}
    </div>
  );
}
