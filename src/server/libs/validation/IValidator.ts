import { type IValidatorIssue } from "./IValidatorIssue";

export interface IValidator {
  Validate: (
    timetableID: string,
    degreeCode: string,
  ) => Promise<{
    isSuccess: boolean;
    failures: IValidatorIssue[];
  }>;
}
