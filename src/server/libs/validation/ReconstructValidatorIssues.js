/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// comments above are to get rid of type checking

import {
  CreditsIssue,
  DegreeRequiredModuleIssue,
  ModuleCreditTrackingIssue,
  ModuleLevelTrackingIssue,
  NotSameTimeIssue,
  PrerequisiteModuleIssue,
} from "./ValidatorIssues";

/**
 * Function which will reconstruct the errors to there classes from json format
 * @param {{ type: string}[]} failures
 * @returns {import("./IValidatorIssue").IValidatorIssue[]}
 */
export function ReconstructValidatorIssues(failures) {
  const validatorIssues = [];

  for (const failure of failures) {
    switch (failure.type) {
      case "DegreeRequiredModuleIssue":
        validatorIssues.push(
          new DegreeRequiredModuleIssue(failure.requiredModule),
        );
        break;
      case "PrerequisiteModuleIssue":
        validatorIssues.push(
          new PrerequisiteModuleIssue(
            failure.requiringModuleCode,
            failure.requiredModule,
          ),
        );
        break;
      case "NotSameTimeIssue":
        validatorIssues.push(
          new NotSameTimeIssue(failure.module1Code, failure.module2Code),
        );
        break;
      case "CreditsIssue":
        validatorIssues.push(new CreditsIssue(failure.occurring));
        break;
      case "ModuleCreditTrackingIssue":
        validatorIssues.push(new ModuleCreditTrackingIssue(failure.occurring));
        break;
      case "ModuleLevelTrackingIssue":
        validatorIssues.push(
          new ModuleLevelTrackingIssue(failure.moduleCode, failure.occurring),
        );
    }
  }
  return validatorIssues;
}
