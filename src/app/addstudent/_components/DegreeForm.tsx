"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/navigation";
import { useState, type Dispatch, type SetStateAction } from "react";
import { BsSearch } from "react-icons/bs";
import { api } from "~/trpc/react";

type Degree = {
  name: string;
  departmentName: string;
  lengthOfDegree: number;
  degreeCode: string;
  degreeID: string;
  yearStarting: number;
};

export default function DegreeForm() {
  const [animationParent] = useAutoAnimate();
  const router = useRouter();

  const [searchString, setSearchString] = useState<string>("");

  const degreeData = api.degree.getDegreeOccurrenceByNameDegreeCode.useQuery({
    searchString,
    limit: 20,
  });

  const [selectedDegree, setSelectedDegree] = useState<Degree>();

  const addDegreeTaken =
    api.student.addDegreeTakenAndDegreeTimetable.useMutation({
      onSuccess: () => {
        router.push("/"); // user created successfully take student to homepage
      },
    });

  return (
    <div className="flex flex-col items-center gap-3">
      {selectedDegree != undefined ? (
        <div className="flex flex-col rounded-md bg-white p-2 text-left">
          <h2 className="text-xl">{selectedDegree.name}</h2>
          <p className="text-sm">
            Year starting: {selectedDegree.yearStarting}
          </p>
          <p>Department: {selectedDegree.departmentName}</p>
          <p className="text-sm">
            Degree Length: {selectedDegree.lengthOfDegree} Degree Code:{" "}
            {selectedDegree.degreeCode}
          </p>
          <button
            className="mt-3 rounded-md p-3 hover:bg-blue"
            onClick={() =>
              addDegreeTaken.mutate({ degreeID: selectedDegree.degreeID })
            }
          >
            Add as Degree Taken
          </button>
        </div>
      ) : null}

      {/* Search degrees */}
      <form className="flex w-96 flex-row items-center gap-4 rounded-md bg-white px-2">
        <BsSearch />
        <input
          className="grow py-1 focus:outline-none"
          type="text"
          value={searchString}
          spellCheck={true}
          onChange={(e) => setSearchString(e.target.value)}
        />
      </form>
      <li ref={animationParent} className="flex flex-col gap-3">
        {degreeData.isLoading ? (
          <h3 className="mx-auto">Loading...</h3>
        ) : degreeData.isSuccess ? (
          degreeData.data.map((degree, index) => (
            <Degree
              degree={degree}
              setSelectedDegree={setSelectedDegree}
              key={index}
            />
          ))
        ) : undefined}
      </li>
    </div>
  );
}

function Degree({
  degree,
  setSelectedDegree,
}: {
  degree: Degree;
  setSelectedDegree: Dispatch<SetStateAction<Degree | undefined>>;
}) {
  return (
    <button
      onClick={() => setSelectedDegree(degree)}
      className="relative flex flex-col rounded-md bg-white p-2 text-left"
    >
      <h2 className="text-xl">{degree.name}</h2>
      <p className="text-sm">Year starting: {degree.yearStarting}</p>
      <p>Department: {degree.departmentName}</p>
      <p className="text-sm">
        Degree Length: {degree.lengthOfDegree} Degree Code: {degree.degreeCode}
      </p>
    </button>
  );
}
