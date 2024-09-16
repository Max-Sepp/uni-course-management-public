import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { api } from "~/trpc/react";

export type Degree = {
  name: string;
  departmentName: string;
  lengthOfDegree: number;
  degreeCode: string;
  degreeID: string;
  yearStarting: number;
};

export default function AddDegreeToTimetable({
  setDegreeID,
}: {
  setDegreeID: (degreeID: string) => void;
}) {
  const [animationParent] = useAutoAnimate();

  // state and search procedure call
  const [searchString, setSearchString] = useState<string>("");

  const degreeData = api.degree.getDegreeOccurrenceByNameDegreeCode.useQuery({
    searchString,
    limit: 20,
  });

  // private setter should not be passed around to other components
  const [selectedDegree, setSelectedDegreePrivate] = useState<Degree>();

  // function to handl selecting a degree
  const setSelectedDegree = (degreeData: Degree) => {
    setSelectedDegreePrivate(degreeData);
    setDegreeID(degreeData.degreeID);
  };

  return (
    <div ref={animationParent} className="flex flex-col items-center gap-3">
      {/* Selected degree */}
      {selectedDegree != undefined ? (
        <>
          <h2>Selected Degree</h2>
          <div className="flex w-80 flex-col rounded-md bg-white p-2 text-left">
            <h2 className="text-xl">{selectedDegree.name}</h2>
            <p className="text-sm">
              Year starting: {selectedDegree.yearStarting}
            </p>
            <p>Department: {selectedDegree.departmentName}</p>
            <p className="text-sm">
              Degree Length: {selectedDegree.lengthOfDegree} Degree Code:{" "}
              {selectedDegree.degreeCode}
            </p>
          </div>
        </>
      ) : null}

      {/* Form to search for degrees */}
      <form className="flex-intial flex w-80 flex-row items-center gap-4 rounded-md bg-white px-2">
        <BsSearch />
        <input
          className="grow py-1 focus:outline-none"
          type="text"
          value={searchString}
          spellCheck={true}
          onChange={(e) => setSearchString(e.target.value)}
        />
      </form>

      {/* The list of degrees shown to the search */}
      {degreeData.isLoading ? (
        <h3 className="mx-auto">Loading...</h3>
      ) : degreeData.isSuccess ? (
        <DegreeList
          degrees={degreeData.data}
          setSelectedDegree={setSelectedDegree}
        />
      ) : undefined}
    </div>
  );
}

// components to show list of degrees to user
function DegreeList({
  degrees,
  setSelectedDegree,
}: {
  degrees: Degree[];
  setSelectedDegree: (degreeData: Degree) => void;
}) {
  return (
    <ul className="flex w-80 flex-col gap-3">
      {degrees.map((degree, index) => (
        <Degree
          degree={degree}
          setSelectedDegree={setSelectedDegree}
          key={index}
        />
      ))}
    </ul>
  );
}

function Degree({
  degree,
  setSelectedDegree,
}: {
  degree: Degree;
  setSelectedDegree: (degreeData: Degree) => void;
}) {
  return (
    <li className="relative flex w-full flex-col rounded-md bg-white p-2 text-left">
      <button onClick={() => setSelectedDegree(degree)}>
        <h2 className="text-lg">{degree.name}</h2>
        <p className="text-sm">Year starting: {degree.yearStarting}</p>
        <p className="text-sm">Department: {degree.departmentName}</p>
        <p className="text-sm">
          Degree Length: {degree.lengthOfDegree} Degree Code:{" "}
          {degree.degreeCode}
        </p>
      </button>
    </li>
  );
}
