"use client";

import { api } from "~/trpc/react";
import Timetables from "./_components/Timetables";

export default function Page() {
  const timetablesData = api.timetable.getTimetables.useQuery();

  if (timetablesData.isLoading) {
    return <h1>Loading...</h1>;
  }

  if (timetablesData.isSuccess) {
    return <Timetables timetables={timetablesData.data} />;
  }
}
