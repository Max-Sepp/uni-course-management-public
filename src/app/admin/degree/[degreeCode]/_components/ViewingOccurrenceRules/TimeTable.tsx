"use client";

import { useViewingContext } from "../../ViewingContext";
import { type Module } from "./ModuleComponent";
import ModuleStackAdd from "./ModuleStackAdd";

export default function TimeTable({
  degreeID,
  modules,
  lengthOfDegree,
}: {
  modules: Module[][];
  lengthOfDegree: number;
  degreeID: string;
}) {
  return (
    <div className="p-5">
      <div className="w-[70rem] rounded-md bg-blue p-3">
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
                degreeID={degreeID}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ModulesMapReturn({
  modules,
  semesterDiv,
  index,
  lengthOfDegree,
  degreeID,
}: {
  modules: Module[];
  semesterDiv: boolean;
  lengthOfDegree: number;
  index: number;
  degreeID: string;
}) {
  const { viewingDegreeYearStart } = useViewingContext();

  if (viewingDegreeYearStart == undefined) {
    throw new Error("viewingDegreeYear Start");
  }

  if (semesterDiv) {
    return (
      <>
        <div key={index + "semester"} className="w-20">
          {index / lengthOfDegree + 1}
        </div>
        <ModuleStackAdd
          degreeID={degreeID}
          semester={Math.floor(index / lengthOfDegree + 1)}
          year={(index % lengthOfDegree) + viewingDegreeYearStart}
          modules={modules}
          key={index}
        />
      </>
    );
  }

  return (
    <ModuleStackAdd
      degreeID={degreeID}
      semester={Math.floor(index / lengthOfDegree + 1)}
      year={(index % lengthOfDegree) + viewingDegreeYearStart}
      modules={modules}
      key={index}
    />
  );
}
