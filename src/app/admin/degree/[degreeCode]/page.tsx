"use client";

import Link from "next/link";
import { useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { api } from "~/trpc/react";
import { ViewingContext } from "./ViewingContext";
import AddOccurrence from "./_components/AddOccurrence";
import { Occuring } from "./_components/Occuring";
import Rules from "./_components/Rules";

export default function Degree({ params }: { params: { degreeCode: string } }) {
  const [viewingDegree, setViewingDegree] = useState<string | undefined>(
    undefined,
  );
  const [viewingDegreeYearStart, setViewingDegreeYearStart] = useState<
    number | undefined
  >(undefined);

  const degree = api.degree.getDegreeByDegreeCode.useQuery({
    degreeCode: params.degreeCode,
  });

  return (
    <ViewingContext.Provider
      value={{
        viewingDegree,
        setViewingDegree,
        viewingDegreeYearStart,
        setViewingDegreeYearStart,
      }}
    >
      <div className="flex flex-col gap-4 p-5">
        <div className="mx-auto flex w-[42rem] flex-row rounded-md bg-blue p-3 text-left shadow-lg">
          <Link href="/admin/degree">
            <BsArrowLeft size={25} />
          </Link>
          <div className="flex-1 px-5">
            {degree.isLoading ? (
              <h1 className="bold text-center text-xl">Loading...</h1>
            ) : degree.isSuccess ? (
              <>
                <h2 className="text-xl">Degree Name: {degree.data?.name}</h2>

                <p>Department: {degree.data?.departmentName}</p>
                <p className="text-sm">
                  Degree Length: {degree.data?.lengthOfDegree} Degree Code:{" "}
                  {degree.data?.degreeCode}
                </p>
              </>
            ) : undefined}
          </div>
        </div>
        {viewingDegree ? (
          <Rules degreeCode={params.degreeCode} degreeID={viewingDegree} />
        ) : undefined}
        <AddOccurrence degreeCode={params.degreeCode} />
        <Occuring degreeCode={params.degreeCode} />
      </div>
    </ViewingContext.Provider>
  );
}
