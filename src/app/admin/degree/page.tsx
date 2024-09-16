"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import { BsPlus, BsSearch } from "react-icons/bs";
import { api } from "~/trpc/react";
import Link from "next/link";

export default function Search() {
  const [animationParent] = useAutoAnimate();

  const [searchString, setSearchString] = useState<string>("");

  const degreeData = api.degree.getDegreeByNameDegreeCode.useQuery({
    searchString,
    limit: 20,
  });

  return (
    <div className="mx-auto mt-3 max-w-4xl rounded-md bg-blue p-3">
      <div className="flex flex-1 flex-col items-stretch gap-3">
        <div className="flex flex-row justify-center gap-4">
          <form className="flex-intial flex w-96 flex-row items-center gap-4 rounded-md bg-white px-2">
            <BsSearch />
            <input
              className="grow py-1 focus:outline-none"
              type="text"
              value={searchString}
              spellCheck={true}
              onChange={(e) => setSearchString(e.target.value)}
            />
          </form>
          <Link href="/admin/degree/add" className="rounded-full bg-white">
            <BsPlus size={32} />
          </Link>
        </div>
        <li ref={animationParent} className="flex flex-col gap-3">
          {degreeData.isLoading ? (
            <h3 className="mx-auto">Loading...</h3>
          ) : degreeData.isSuccess ? (
            degreeData.data.map((degree, index) => (
              <div
                key={index}
                className="relative flex flex-col rounded-md bg-white p-2 text-left"
              >
                <Link href={`degree/${degree.degreeCode}`}>
                  <h2 className="text-xl hover:underline">{degree.name}</h2>
                </Link>
                <p>Department: {degree.departmentName}</p>
                <p className="text-sm">
                  Degree Length: {degree.lengthOfDegree} Degree Code:{" "}
                  {degree.degreeCode}
                </p>
              </div>
            ))
          ) : undefined}
        </li>
      </div>
    </div>
  );
}
