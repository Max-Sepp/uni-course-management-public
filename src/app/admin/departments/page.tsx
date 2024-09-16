"use client";

import AddDepartment from "./AddDepartment";
import { Departments } from "./Departments";

export default function Module() {
  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="mx-auto w-[42rem] rounded-md bg-blue p-3 text-left shadow-lg">
        <h2 className="bold text-center text-xl">Departments</h2>
      </div>
      <AddDepartment />
      <Departments />
    </div>
  );
}
