"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { api } from "~/trpc/react";

export function Departments() {
  const [animationParent] = useAutoAnimate();

  const departments = api.department.getDepartments.useQuery();

  if (departments.isLoading) {
    return (
      <div className="mx-auto w-[42rem] rounded-md bg-blue p-3 text-left shadow-lg">
        <h2 className="bold text-md text-center">Loading...</h2>
      </div>
    );
  }

  if (departments.isSuccess) {
    if (departments.data.length == 0) {
      return (
        <div className="mx-auto w-[42rem] rounded-md bg-blue p-3 text-left shadow-lg">
          <h2 className="bold text-md text-center">
            No departments have been made yet
          </h2>
        </div>
      );
    }
    return (
      <ul ref={animationParent} className="flex flex-col gap-3">
        {departments.data.map((val, index) => (
          <li
            key={index}
            className="mx-auto w-[42rem] rounded-md bg-blue p-3 text-left shadow-lg"
          >
            <p>{val.name}</p>
          </li>
        ))}
      </ul>
    );
  }
}
