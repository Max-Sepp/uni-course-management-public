"use client";

import { api } from "~/trpc/react";

export default function TimetableDetails({
  degreeID,
  timetableName,
}: {
  degreeID: string;
  timetableName: string;
}) {
  const degree = api.degree.getDegreeByDegreeID.useQuery({ degreeID });

  if (degree.isLoading) {
    <div className="w-full rounded-lg bg-blue p-3 shadow-lg">
      <h1>Loading...</h1>
    </div>;
  }

  if (degree.isSuccess) {
    return (
      <div className="w-full rounded-lg bg-blue p-3 shadow-lg">
        <h1>Timetable: {timetableName}</h1>
        <p>
          Degree: {degree.data?.name} with Starting Year:{" "}
          {degree.data?.yearStarting}
        </p>
      </div>
    );
  }
}
