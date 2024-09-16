"use client";

import { useState } from "react";
import Credits from "./Credits/Credits";
import DegreeTrackingRule from "./DegreeTrackingRule/DegreeTrackingRule";
import ViewingOccurrenceRules from "./ViewingOccurrenceRules/ViewingOccurrenceRules";

export default function Rules({
  degreeID,
  degreeCode,
}: {
  degreeID: string;
  degreeCode: string;
}) {
  const [addingWhatRule, setAddingRule] = useState("credits");
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center rounded-md bg-blue pt-3 text-center shadow-lg">
      <h2 className="text-xl">
        Viewing rules of Hightlighted Degree Occurrence
      </h2>
      <nav className="mx-3 flex flex-row gap-4">
        <button
          onClick={() => setAddingRule("credits")}
          className={`rounded-md p-2 hover:underline ${
            addingWhatRule == "credits" ? "bg-white" : "bg-blue"
          }`}
        >
          Credits
        </button>
        <button
          onClick={() => setAddingRule("occurrenceRule")}
          className={`rounded-md p-2  hover:underline ${
            addingWhatRule == "occurrenceRule" ? "bg-white" : "bg-blue"
          }`}
        >
          Degree Required Modules
        </button>
        <button
          onClick={() => setAddingRule("trackingRule")}
          className={`rounded-md p-2  hover:underline ${
            addingWhatRule == "trackingRule" ? "bg-white" : "bg-blue"
          }`}
        >
          Degree Backtracking and Forwardtracking Modules
        </button>
      </nav>
      {addingWhatRule == "credits" ? (
        <Credits degreeCode={degreeCode} degreeID={degreeID} />
      ) : addingWhatRule == "occurrenceRule" ? (
        <ViewingOccurrenceRules degreeID={degreeID} />
      ) : (
        <DegreeTrackingRule degreeID={degreeID} />
      )}
    </div>
  );
}
