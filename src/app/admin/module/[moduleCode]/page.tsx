"use client";

import Link from "next/link";
import { useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { api } from "~/trpc/react";
import { ViewingContext } from "./ViewingContext";
import AddOccurrence from "./_components/AddOccurrence";
import { Occuring } from "./_components/Occuring";
import ViewModule from "./_components/ViewModule";
import ViewRules from "./_components/ViewRules";

export default function Module({ params }: { params: { moduleCode: string } }) {
  const aModule = api.module.getModuleByModuleCode.useQuery({
    moduleCode: params.moduleCode,
  });

  const [viewingModule, setViewingModule] = useState<string | undefined>(
    undefined,
  );

  return (
    <ViewingContext.Provider value={{ viewingModule, setViewingModule }}>
      <div className="flex flex-col gap-4 p-5">
        <div className="mx-auto flex w-[42rem] flex-row rounded-md bg-blue p-3 text-left shadow-lg">
          <Link href="/admin/module">
            <BsArrowLeft size={25} />
          </Link>
          <div className="flex-1 px-5">
            {aModule.isLoading ? (
              <h1 className="bold text-center text-xl">Loading...</h1>
            ) : aModule.isSuccess ? (
              <ViewModule moduleData={aModule.data} />
            ) : null}
          </div>
        </div>
        {viewingModule != undefined ? (
          <>
            <ViewRules />
            <Link
              className="mx-auto w-[42rem] rounded-md bg-blue p-2 text-center text-lg shadow-lg  hover:underline"
              href={`/admin/module/occurrence/${viewingModule}/rules`}
            >
              Edit Rules
            </Link>
          </>
        ) : null}
        <AddOccurrence moduleCode={params.moduleCode} />
        <Occuring moduleCode={params.moduleCode} />
      </div>
    </ViewingContext.Provider>
  );
}
