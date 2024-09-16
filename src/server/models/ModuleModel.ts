import { eq } from "drizzle-orm";
import { type db } from "~/server/db/db";
import { moduleItem, moduleOccurrence } from "~/server/db/schema";

export interface IModuleModel {
  GetModuleByModuleID(moduleID: string): Promise<
    | {
        moduleID: string;
        moduleCode: string;
        moduleName: string;
        credits: number;
        semester: number;
        year: number;
        moduleLevel: number;
      }
    | undefined
  >;
}

export class ModuleModel implements IModuleModel {
  private db: db;

  public constructor(db: db) {
    this.db = db;
  }

  public async GetModuleByModuleID(moduleID: string) {
    const output = await this.db
      .select({
        moduleID: moduleOccurrence.moduleID,
        moduleCode: moduleOccurrence.moduleCode,
        moduleName: moduleItem.moduleName,
        credits: moduleOccurrence.credits,
        semester: moduleOccurrence.semester,
        year: moduleOccurrence.year,
        moduleLevel: moduleOccurrence.moduleLevel,
      })
      .from(moduleOccurrence)
      .innerJoin(
        moduleItem,
        eq(moduleOccurrence.moduleCode, moduleItem.moduleCode),
      )
      .where(eq(moduleOccurrence.moduleID, moduleID));

    return output[0];
  }
}
