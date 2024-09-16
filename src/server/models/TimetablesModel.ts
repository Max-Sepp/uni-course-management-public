import { eq, inArray } from "drizzle-orm";
import { union } from "drizzle-orm/pg-core";
import { type db } from "~/server/db/db";
import {
  choices,
  creditsRequired,
  degreeRequiredModule,
  moduleItem,
  moduleNotSameTime,
  moduleOccurrence,
  moduleTracking,
  prerequisiteModule,
} from "~/server/db/schema";

export interface IPathModel {
  GetModulesOfPathID(timetableID: string): Promise<
    {
      moduleID: string;
      moduleCode: string;
      moduleName: string;
      credits: number;
      semester: number;
      year: number;
      moduleLevel: number;
    }[]
  >;
  GetCreditsRequired(degreeID: string): Promise<
    {
      creditsRequired: number;
      semester: number;
      year: number;
    }[]
  >;
  GetDegreeRequiredModules(degreeID: string): Promise<
    {
      moduleID: string;
    }[]
  >;
  GetPrerequisiteModules(moduleCodes: string[]): Promise<
    {
      prerequisiteModule: string;
      moduleRequiring: string;
    }[]
  >;
  GetModuleNotSameTime(moduleCodes: string[]): Promise<
    {
      module1: string;
      module2: string;
    }[]
  >;
  GetTrackingRule(
    degreeID: string,
  ): Promise<
    { numberYearsTracking: number; numberCreditsTracked: number } | undefined
  >;
  GetModuleLevels(degreeID: string): Promise<
    {
      moduleLevel: number;
      semester: number;
      year: number;
    }[]
  >;
}

export class TimetablesModel implements IPathModel {
  private db: db;

  public constructor(db: db) {
    this.db = db;
  }
  async GetTrackingRule(degreeID: string) {
    const output = await this.db
      .select({
        numberYearsTracking: moduleTracking.numberYearsTracking,
        numberCreditsTracked: moduleTracking.numberCreditsTracked,
      })
      .from(moduleTracking)
      .where(eq(moduleTracking.degreeID, degreeID));
    return output[0];
  }

  public async GetModulesOfPathID(timetableID: string) {
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
      .from(choices)
      .innerJoin(
        moduleOccurrence,
        eq(choices.moduleID, moduleOccurrence.moduleID),
      )
      .innerJoin(
        moduleItem,
        eq(moduleOccurrence.moduleCode, moduleItem.moduleCode),
      )
      .where(eq(choices.timetableID, timetableID));

    return output;
  }

  public async GetCreditsRequired(degreeID: string) {
    const output = await this.db
      .select({
        creditsRequired: creditsRequired.creditsRequired,
        semester: creditsRequired.semester,
        year: creditsRequired.year,
      })
      .from(creditsRequired)
      .where(eq(creditsRequired.degreeID, degreeID));

    return output;
  }

  public async GetDegreeRequiredModules(degreeID: string) {
    const output = await this.db
      .select({ moduleID: degreeRequiredModule.moduleID })
      .from(degreeRequiredModule)
      .where(eq(degreeRequiredModule.degreeID, degreeID));

    return output;
  }

  public async GetPrerequisiteModules(moduleIDs: string[]): Promise<
    {
      prerequisiteModule: string;
      moduleRequiring: string;
    }[]
  > {
    if (moduleIDs.length <= 0) {
      return [];
    }

    const output = await this.db
      .select()
      .from(prerequisiteModule)
      .where(inArray(prerequisiteModule.moduleRequiring, moduleIDs));

    return output;
  }

  public async GetModuleNotSameTime(moduleIDs: string[]): Promise<
    {
      module1: string;
      module2: string;
    }[]
  > {
    if (moduleIDs.length <= 0) {
      return [];
    }

    const leftModules = this.db
      .select()
      .from(moduleNotSameTime)
      .where(inArray(moduleNotSameTime.module1, moduleIDs));

    const rightModules = this.db
      .select()
      .from(moduleNotSameTime)
      .where(inArray(moduleNotSameTime.module2, moduleIDs));

    return await union(leftModules, rightModules);
  }

  public async GetModuleLevels(degreeID: string) {
    const output = await this.db
      .select({
        moduleLevel: creditsRequired.moduleLevel,
        semester: creditsRequired.semester,
        year: creditsRequired.year,
      })
      .from(creditsRequired)
      .where(eq(creditsRequired.degreeID, degreeID));

    return output;
  }
}
