import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useViewingContext } from "../ViewingContext";

export default function Occurrence({
  yearStarting,
  degreeID,
}: {
  yearStarting: number;
  degreeID: string;
}) {
  const [animationParent] = useAutoAnimate();

  const { viewingDegree, setViewingDegree, setViewingDegreeYearStart } =
    useViewingContext();

  function handleViewingChange() {
    if (viewingDegree == degreeID) {
      setViewingDegree(undefined);
      setViewingDegreeYearStart(undefined);
    } else {
      setViewingDegree(degreeID);
      setViewingDegreeYearStart(yearStarting);
    }
  }

  return (
    <li
      ref={animationParent}
      className={`group/module relative mx-auto flex w-[42rem] flex-col items-center gap-3 rounded-md bg-blue p-2 text-center shadow-lg ${
        viewingDegree == degreeID ? "border-4 border-gunmetal" : null
      }`}
    >
      <button
        className="w-fit rounded-lg p-2 hover:bg-white"
        onClick={handleViewingChange}
      >
        <p>Year Commencing: {yearStarting}</p>
      </button>
    </li>
  );
}
