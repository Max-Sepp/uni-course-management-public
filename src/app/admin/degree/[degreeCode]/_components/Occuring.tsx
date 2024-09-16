"use client";

import { api } from "~/trpc/react";
import Occurrence from "./Occurrence";

export function Occuring({ degreeCode }: { degreeCode: string }) {
  const timesDegreeStart =
    api.admin.degree.getSpecificDegreeByDegreeCode.useQuery({
      degreeCode,
    });

  if (timesDegreeStart.isLoading) {
    return (
      <div className="mx-auto w-[42rem] rounded-md bg-blue p-3 text-left shadow-lg">
        <h2 className="bold text-md text-center">Loading...</h2>
      </div>
    );
  }

  if (timesDegreeStart.isSuccess) {
    if (timesDegreeStart.data.length == 0) {
      return (
        <div className="mx-auto w-[42rem] rounded-md bg-blue p-3 text-left shadow-lg">
          <h2 className="bold text-md text-center">
            Has no times when the degree has happened or is going to happen
          </h2>
        </div>
      );
    }

    timesDegreeStart.data.sort((a, b) => b.yearStarting - a.yearStarting);
    return (
      <ul className="flex flex-col gap-3">
        {timesDegreeStart.data.map((val, index) => (
          <Occurrence
            key={index}
            yearStarting={val.yearStarting}
            degreeID={val.degreeID}
          />
        ))}
      </ul>
    );
  }
}
