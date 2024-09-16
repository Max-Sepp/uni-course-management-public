"use client";

import { api } from "~/trpc/react";
import DegreeTrackingRuleForm from "./DegreeTrackingRuleForm";

export default function DegreeTrackingRule({ degreeID }: { degreeID: string }) {
  const currentTrackingRules =
    api.admin.rules.getModuleTrackingByDegreeID.useQuery({
      degreeID,
    });

  if (currentTrackingRules.isSuccess) {
    return (
      <DegreeTrackingRuleForm
        degreeID={degreeID}
        defaultValues={
          currentTrackingRules.data == "notfound"
            ? undefined
            : currentTrackingRules.data
        }
      />
    );
  }

  return <h1>Loading...</h1>;
}
