"use client";

import { useState } from "react";
import NotSameTime from "./NotSameTime";
import PrerequisiteModule from "./PrerequisiteModule";

export default function ViewRules() {
  const [addingRule, setAddingRule] = useState<string>("prerequisiteModule");

  return (
    <div className="mx-auto flex w-[42rem] flex-col items-center rounded-md bg-blue p-3 text-left shadow-lg">
      <nav className="flex flex-row gap-4 ">
        <button
          onClick={() => setAddingRule("prerequisiteModule")}
          className={`rounded-md p-2 hover:underline ${
            addingRule == "prerequisiteModule" ? "bg-white" : "bg-blue"
          }`}
        >
          Prerequisite Module
        </button>
        <button
          onClick={() => setAddingRule("notSameTime")}
          className={`rounded-md p-2  hover:underline ${
            addingRule == "notSameTime" ? "bg-white" : "bg-blue"
          }`}
        >
          Module Not Taken at Same Time
        </button>
      </nav>
      {addingRule == "prerequisiteModule" ? (
        <PrerequisiteModule />
      ) : (
        <NotSameTime />
      )}
    </div>
  );
}
