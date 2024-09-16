import { db } from "~/server/db/db";
import { TimetablesModel } from "~/server/models/TimetablesModel";
import { ServerValidation } from "./ServerValidator";
import { ModuleModel } from "~/server/models/ModuleModel";
import { DegreeModel } from "~/server/models/DegreeModel";

export const serverRuleValidator = new ServerValidation(
  new TimetablesModel(db),
  new ModuleModel(db),
  new DegreeModel(db),
);
