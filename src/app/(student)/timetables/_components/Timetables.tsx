"use client";

import Link from "next/link";
import { useState } from "react";
import { BsPlus, BsTrash3Fill } from "react-icons/bs";
import { api } from "~/trpc/react";
import AddPath from "./AddTimetable";

export default function Timetables({
  timetables,
}: {
  timetables: { name: string; timetableID: string }[];
}) {
  const [add, setAdd] = useState(false);

  function handleAdd() {
    setAdd(true);
  }

  if (add) {
    return <AddPath setAdd={setAdd} />;
  }

  return (
    <div className="p-5">
      <div className="mx-auto flex max-w-2xl flex-col gap-3 rounded-md bg-blue p-3 shadow-lg">
        <h1 className="text-center text-4xl font-bold">Your Timetables</h1>
        {timetables.map((value) => (
          <Path
            key={value.timetableID}
            name={value.name}
            timetableID={value.timetableID}
          />
        ))}
        <div onClick={handleAdd} className="rounded-md bg-white p-1">
          <BsPlus size={25} className="mx-auto" />
        </div>
      </div>
    </div>
  );
}

function Path({ name, timetableID }: { name: string; timetableID: string }) {
  const apiUtil = api.useUtils();
  const deleteMutation = api.timetable.deletePath.useMutation({
    onSuccess: async () => {
      await apiUtil.timetable.getTimetables.invalidate();
    },
  });

  function handleDelete() {
    deleteMutation.mutate({ id: timetableID });
  }
  return (
    <div className="group/timetable flex flex-row items-center justify-between rounded-md bg-white p-2">
      <Link
        href={`/timetables/${timetableID}`}
        className="text-xl hover:underline"
      >
        {name}
      </Link>
      <button
        onClick={handleDelete}
        className="invisible rounded-md bg-red p-1 group-hover/timetable:visible"
      >
        <BsTrash3Fill />
      </button>
    </div>
  );
}
